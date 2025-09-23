
import React from "react";
import { SearchFilters } from "@/components/search";
import { useSearch } from "@/hooks/use-search";
import type { CreditWithMetadata, DashboardStats } from "@/lib/types";

interface CreditFiltersProps {
  credits: CreditWithMetadata[];
  stats: DashboardStats;
  onFilteredResults: (filteredCredits: CreditWithMetadata[]) => void;
  onSearchStateChange?: (hasActiveFilters: boolean, searchQuery: string, clearFilters: () => void) => void;
}

/**
 * Enhanced credit filters component using the new search system
 * Addresses requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */
export function CreditFilters({ credits, stats, onFilteredResults, onSearchStateChange }: CreditFiltersProps) {
  const {
    searchState,
    filteredResults,
    setQuery,
    setStatusFilter,
    setVintageFilter,
    clearFilters,
  } = useSearch(credits);

  // Update parent component with filtered results and search state
  React.useEffect(() => {
    onFilteredResults(filteredResults.credits);
    onSearchStateChange?.(filteredResults.hasActiveFilters, searchState.query, clearFilters);
  }, [filteredResults.credits, filteredResults.hasActiveFilters, searchState.query, clearFilters, onFilteredResults, onSearchStateChange]);

  return (
    <div className="py-4">
      <SearchFilters
        searchState={searchState}
        onSearch={setQuery}
        onFilterStatus={setStatusFilter}
        onFilterVintage={setVintageFilter}
        onClearFilters={clearFilters}
        availableVintages={stats.availableVintages}
        resultCount={filteredResults.filteredCount}
        totalCount={filteredResults.totalCount}
      />
    </div>
  );
}
