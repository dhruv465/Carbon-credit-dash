import { useState, useMemo, useCallback, useRef } from 'react';
import { useDebounce } from './use-debounce';
import { searchAndFilterCredits } from '@/lib/data';
import type { 
  CreditWithMetadata, 
  SearchState, 
  FilteredResults, 
  UseSearchReturn,
  Credit 
} from '@/lib/types';

/**
 * Custom hook for search and filter functionality with enhanced performance optimizations
 * Includes debouncing, memoization, and optimized re-render prevention
 * Addresses requirements: 3.1, 3.2, 3.3, 6.1, 6.2, 6.3
 */
export function useSearch(credits: CreditWithMetadata[]): UseSearchReturn {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    statusFilter: 'all',
    vintageFilter: 'all',
    sortBy: 'project_name',
    sortOrder: 'asc',
  });

  // Use the dedicated debounce hook for better performance (300ms delay)
  const debouncedQuery = useDebounce(searchState.query, 300);
  
  // Cache previous results to avoid unnecessary recalculations
  const previousResultsRef = useRef<FilteredResults | null>(null);
  const previousDepsRef = useRef<string>('');

  // Memoized filtered results with enhanced performance optimization
  const filteredResults: FilteredResults = useMemo(() => {
    // Create a dependency key for comparison
    const currentDeps = `${credits.length}-${debouncedQuery}-${searchState.statusFilter}-${searchState.vintageFilter}-${searchState.sortBy}-${searchState.sortOrder}`;
    
    // Return cached results if dependencies haven't changed
    if (previousDepsRef.current === currentDeps && previousResultsRef.current) {
      return previousResultsRef.current;
    }

    const filtered = searchAndFilterCredits(
      credits,
      debouncedQuery,
      searchState.statusFilter,
      searchState.vintageFilter,
      searchState.sortBy,
      searchState.sortOrder
    );

    const hasActiveFilters = 
      debouncedQuery.trim() !== '' ||
      searchState.statusFilter !== 'all' ||
      searchState.vintageFilter !== 'all';

    const result = {
      credits: filtered,
      totalCount: credits.length,
      filteredCount: filtered.length,
      hasActiveFilters,
    };

    // Cache the results
    previousResultsRef.current = result;
    previousDepsRef.current = currentDeps;

    return result;
  }, [
    credits,
    debouncedQuery,
    searchState.statusFilter,
    searchState.vintageFilter,
    searchState.sortBy,
    searchState.sortOrder,
  ]);

  // Optimized setter functions to prevent unnecessary re-renders
  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  }, []);

  const setStatusFilter = useCallback((statusFilter: Credit['status'] | 'all') => {
    setSearchState(prev => ({ ...prev, statusFilter }));
  }, []);

  const setVintageFilter = useCallback((vintageFilter: number | 'all') => {
    setSearchState(prev => ({ ...prev, vintageFilter }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchState['sortBy']) => {
    setSearchState(prev => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SearchState['sortOrder']) => {
    setSearchState(prev => ({ ...prev, sortOrder }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState({
      query: '',
      statusFilter: 'all',
      vintageFilter: 'all',
      sortBy: 'project_name',
      sortOrder: 'asc',
    });
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    searchState,
    filteredResults,
    setQuery,
    setStatusFilter,
    setVintageFilter,
    setSortBy,
    setSortOrder,
    clearFilters,
  }), [
    searchState,
    filteredResults,
    setQuery,
    setStatusFilter,
    setVintageFilter,
    setSortBy,
    setSortOrder,
    clearFilters,
  ]);
}