import { AccessibilityFeature, DisciplineName, EventDuration, InclusivityFeature, LanguageName, TimeOfDay } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventFilters } from '../types/index';

const FILTER_STORAGE_KEY = '@event_filters';
const FILTER_QUERY_KEY = ['eventFilters'] as const;

// Default filter state
const defaultFilters: EventFilters = {
  format: undefined,
  disciplines: [],
  languages: [],
  eventType: undefined,
  startDateTime: undefined,
  endDateTime: undefined,
  searchTerm: '',
  sortBy: 'startDate',
  sortOrder: 'asc',

  // New filtering options
  priceRange: undefined,
  hasFeaturedGuests: undefined,
  hasTickets: undefined,
  location: undefined,
  videoConferencePlatform: undefined,
  organizerId: undefined,
  timezone: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  parkingAvailable: undefined,

  // Duration and time filtering
  duration: undefined,
  timeOfDay: undefined,

  // Accessibility and inclusivity filtering
  accessibilityFeatures: [],
  inclusivityFeatures: [],
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
    if (stored) {
      const parsedFilters = JSON.parse(stored);
      // Merge with defaultFilters to ensure all fields are present
      return { ...defaultFilters, ...parsedFilters };
    }
    return defaultFilters;
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
  toggleLanguage: (language: LanguageName) => Promise<void>;

  // New helper functions for enhanced filtering
  updateLocationFilter: (locationUpdate: Partial<EventFilters['location']>) => Promise<void>;
  clearLocationFilter: () => Promise<void>;
  toggleFeaturedGuests: () => Promise<void>;
  toggleHasTickets: () => Promise<void>;
  updatePriceRange: (min?: number, max?: number) => Promise<void>;
  clearPriceRange: () => Promise<void>;

  // DateTime filtering helpers
  updateStartDateTime: (dateTime: string) => Promise<void>;
  clearStartDateTime: () => Promise<void>;
  updateEndDateTime: (dateTime: string) => Promise<void>;
  clearEndDateTime: () => Promise<void>;

  // Timezone filtering helpers
  updateTimezone: (timezone: string) => Promise<void>;
  clearTimezone: () => Promise<void>;

  // Duration filtering helpers
  updateDuration: (duration: EventDuration) => Promise<void>;
  clearDuration: () => Promise<void>;

  // Time of day filtering helpers
  updateTimeOfDay: (timeOfDay: TimeOfDay) => Promise<void>;
  clearTimeOfDay: () => Promise<void>;

  // Accessibility features filtering helpers
  toggleAccessibilityFeature: (feature: AccessibilityFeature) => Promise<void>;
  clearAccessibilityFeatures: () => Promise<void>;

  // Inclusivity features filtering helpers
  toggleInclusivityFeature: (feature: InclusivityFeature) => Promise<void>;
  clearInclusivityFeatures: () => Promise<void>;
}

// Custom hook for managing event filters
export const useEventFilters = (initialFilters?: Partial<EventFilters>): UseEventFiltersReturn => {
  const queryClient = useQueryClient();

  // Query to manage filter state
  const {
    data: filters = { ...defaultFilters, ...initialFilters },
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

  // Function to toggle language selection
  const toggleLanguage = async (language: LanguageName): Promise<void> => {
    const currentLanguages = filters.languages;
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];

    await updateFilter('languages', updatedLanguages);
  };

  // New helper functions for enhanced filtering
  const updateLocationFilter = async (locationUpdate: Partial<EventFilters['location']>): Promise<void> => {
    const currentLocation = filters.location || {};
    const updatedLocation = { ...currentLocation, ...locationUpdate };
    await updateFilter('location', updatedLocation);
  };

  const clearLocationFilter = async (): Promise<void> => {
    await updateFilter('location', undefined);
  };

  const toggleFeaturedGuests = async (): Promise<void> => {
    const currentValue = filters.hasFeaturedGuests;
    await updateFilter('hasFeaturedGuests', currentValue === true ? undefined : true);
  };

  const toggleHasTickets = async (): Promise<void> => {
    const currentValue = filters.hasTickets;
    await updateFilter('hasTickets', currentValue === true ? undefined : true);
  };

  const updatePriceRange = async (min?: number, max?: number): Promise<void> => {
    const updates: Partial<EventFilters> = {};
    if (min !== undefined) updates.minPrice = min;
    if (max !== undefined) updates.maxPrice = max;
    await updateFilters(updates);
  };

  const clearPriceRange = async (): Promise<void> => {
    await updateFilters({ minPrice: undefined, maxPrice: undefined, priceRange: undefined });
  };

  // DateTime filtering helpers
  const updateStartDateTime = async (dateTime: string): Promise<void> => {
    await updateFilter('startDateTime', dateTime);
  };

  const clearStartDateTime = async (): Promise<void> => {
    await updateFilter('startDateTime', undefined);
  };

  const updateEndDateTime = async (dateTime: string): Promise<void> => {
    await updateFilter('endDateTime', dateTime);
  };

  const clearEndDateTime = async (): Promise<void> => {
    await updateFilter('endDateTime', undefined);
  };

  const updateTimezone = async (timezone: string): Promise<void> => {
    await updateFilter('timezone', timezone);
  };

  const clearTimezone = async (): Promise<void> => {
    await updateFilter('timezone', undefined);
  };

  // Duration filtering helpers
  const updateDuration = async (duration: EventDuration): Promise<void> => {
    await updateFilter('duration', duration);
  };

  const clearDuration = async (): Promise<void> => {
    await updateFilter('duration', undefined);
  };

  // Time of day filtering helpers
  const updateTimeOfDay = async (timeOfDay: TimeOfDay): Promise<void> => {
    await updateFilter('timeOfDay', timeOfDay);
  };

  const clearTimeOfDay = async (): Promise<void> => {
    await updateFilter('timeOfDay', undefined);
  };

  // Accessibility features filtering helpers
  const toggleAccessibilityFeature = async (feature: AccessibilityFeature): Promise<void> => {
    const currentFeatures = filters.accessibilityFeatures || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    await updateFilter('accessibilityFeatures', newFeatures);
  };

  const clearAccessibilityFeatures = async (): Promise<void> => {
    await updateFilter('accessibilityFeatures', []);
  };

  // Inclusivity features filtering helpers
  const toggleInclusivityFeature = async (feature: InclusivityFeature): Promise<void> => {
    const currentFeatures = filters.inclusivityFeatures || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    await updateFilter('inclusivityFeatures', newFeatures);
  };

  const clearInclusivityFeatures = async (): Promise<void> => {
    await updateFilter('inclusivityFeatures', []);
  };

  return {
    filters,
    isLoadingFilters,
    updateFilters,
    updateFilter,
    resetFilters,
    toggleDiscipline,
    toggleLanguage,
    updateLocationFilter,
    clearLocationFilter,
    toggleFeaturedGuests,
    toggleHasTickets,
    updatePriceRange,
    clearPriceRange,
    updateStartDateTime,
    clearStartDateTime,
    updateEndDateTime,
    clearEndDateTime,
    updateTimezone,
    clearTimezone,
    updateDuration,
    clearDuration,
    updateTimeOfDay,
    clearTimeOfDay,
    toggleAccessibilityFeature,
    clearAccessibilityFeatures,
    toggleInclusivityFeature,
    clearInclusivityFeatures,
  };
};