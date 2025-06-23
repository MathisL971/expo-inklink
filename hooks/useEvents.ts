// hooks/useEvents.ts
import { fetchEventsWithFilters } from '@/services/event';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Event } from '../types/index';
import { useEventFilters } from './useEventFilters';

export const useEvents = ({
  futureOnly = false,
}: {
  futureOnly?: boolean;
}): UseQueryResult<{
    events: Event[];
    count: number;
}, Error> => {
  const { filters, isLoadingFilters } = useEventFilters({
    dateRange: futureOnly ? "future" : undefined,
  });

  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEventsWithFilters(filters),
    enabled: !isLoadingFilters,
    staleTime: 1000 * 60 * 5,
  });
};