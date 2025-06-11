import { DisciplineName } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventFilters } from '../types/index';

const FILTER_STORAGE_KEY = '@event_filters';
const FILTER_QUERY_KEY = ['eventFilters'] as const;

// Default filter state
const defaultFilters: EventFilters = {
  format: null,
  disciplines: [],
  access: null,
  searchTerm: '',
  sortBy: 'startDate',
  sortOrder: 'asc'
};

// Storage utilities
const saveFiltersToStorage = async (filters: EventFilters): Promise<void> => {
  try {
    await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to save filters to storage:', error);
  }
};

const loadFiltersFromStorage = async (): Promise<EventFilters> => {
  try {
    const stored = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultFilters;
  } catch (error) {
    console.warn('Failed to load filters from storage:', error);
    return defaultFilters;
  }
};

interface UseEventFiltersReturn {
  filters: EventFilters;
  isLoadingFilters: boolean;
  updateFilters: (newFilters: Partial<EventFilters>) => Promise<void>;
  updateFilter: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => Promise<void>;
  resetFilters: () => Promise<void>;
  toggleDiscipline: (discipline: DisciplineName) => Promise<void>;
}

// Custom hook for managing event filters
export const useEventFilters = (): UseEventFiltersReturn => {
  const queryClient = useQueryClient();

  // Query to manage filter state
  const {
    data: filters = defaultFilters,
    isLoading: isLoadingFilters
  } = useQuery({
    queryKey: FILTER_QUERY_KEY,
    queryFn: loadFiltersFromStorage,
    staleTime: Infinity, // Filters don't go stale
    gcTime: Infinity, // Keep in cache forever (formerly cacheTime)
  });

  // Function to update filters
  const updateFilters = async (newFilters: Partial<EventFilters>): Promise<void> => {
    const updatedFilters: EventFilters = { ...filters, ...newFilters };
    
    // Update the query cache immediately
    queryClient.setQueryData(FILTER_QUERY_KEY, updatedFilters);
    
    // Save to persistent storage
    await saveFiltersToStorage(updatedFilters);
    
    // Invalidate events query to trigger refetch with new filters
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  // Function to reset filters
  const resetFilters = async (): Promise<void> => {
    queryClient.setQueryData(FILTER_QUERY_KEY, defaultFilters);
    await saveFiltersToStorage(defaultFilters);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  // Function to update a single filter
  const updateFilter = async <K extends keyof EventFilters>(
    key: K, 
    value: EventFilters[K]
  ): Promise<void> => {
    await updateFilters({ [key]: value } as Partial<EventFilters>);
  };

  // Function to toggle discipline selection
  const toggleDiscipline = async (discipline: DisciplineName): Promise<void> => {
    const currentDisciplines = filters.disciplines;
    const updatedDisciplines = currentDisciplines.includes(discipline)
      ? currentDisciplines.filter(d => d !== discipline)
      : [...currentDisciplines, discipline];
    
    await updateFilter('disciplines', updatedDisciplines);
  };

  return {
    filters,
    isLoadingFilters,
    updateFilters,
    updateFilter,
    resetFilters,
    toggleDiscipline
  };
};