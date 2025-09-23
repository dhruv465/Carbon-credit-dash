import React from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./search-bar";
import { StatusFilter, VintageFilter } from "./filter-dropdown";
import type { Credit, SearchState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchState: SearchState;
  onSearch: (query: string) => void;
  onFilterStatus: (status: Credit['status'] | 'all') => void;
  onFilterVintage: (vintage: number | 'all') => void;
  onClearFilters: () => void;
  availableVintages: number[];
  resultCount?: number;
  totalCount?: number;
  className?: string;
}

/**
 * Combined search and filter controls with clear functionality
 * Addresses requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.3 (performance optimization with React.memo)
 */
const SearchFilters = React.memo<SearchFiltersProps>(({
  searchState,
  onSearch,
  onFilterStatus,
  onFilterVintage,
  onClearFilters,
  availableVintages,
  resultCount,
  totalCount,
  className = ""
}) => {
  const hasActiveFilters = 
    searchState.query.trim() !== '' ||
    searchState.statusFilter !== 'all' ||
    searchState.vintageFilter !== 'all';

  const activeFilterCount = [
    searchState.query.trim() !== '',
    searchState.statusFilter !== 'all',
    searchState.vintageFilter !== 'all',
  ].filter(Boolean).length;

  return (
    <section 
      className={`space-y-4 animate-slide-down ${className}`}
      id="search-section"
      aria-label="Search and filter carbon credits"
    >
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Search Bar - Full Width */}
        <div className="w-full">
          <SearchBar
            value={searchState.query}
            onChange={onSearch}
            placeholder="Search credits by project name or UNIC ID..."
            className="w-full h-12 sm:h-10 text-base sm:text-sm" // Larger on mobile
          />
        </div>
        
        {/* Filter Controls - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex gap-2 flex-1">
            <StatusFilter
              value={searchState.statusFilter}
              onChange={onFilterStatus}
              className="flex-1 sm:min-w-[120px] h-12 sm:h-10" // Larger touch targets on mobile
            />
            
            <VintageFilter
              value={searchState.vintageFilter}
              onChange={onFilterVintage}
              availableVintages={availableVintages}
              className="flex-1 sm:min-w-[130px] h-12 sm:h-10" // Larger touch targets on mobile
            />
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className={cn(
                "flex items-center justify-center gap-2 h-12 sm:h-10",
                "w-full sm:w-auto sm:min-w-[100px]",
                "text-base sm:text-sm font-medium",
                "transition-smooth hover:border-primary/50 hover:text-primary focus-ring-enhanced animate-scale-in",
                "touch-manipulation active:scale-95"
              )}
              aria-label="Clear all filters"
            >
              <FilterX className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Clear All Filters</span>
              <span className="hidden sm:inline">Clear</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs transition-colors-smooth">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary - Mobile Optimized */}
      {(resultCount !== undefined && totalCount !== undefined) && (
        <div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="font-medium">
            {hasActiveFilters ? (
              <span>
                Showing {resultCount} of {totalCount} credits
                {searchState.query && (
                  <span className="block sm:inline"> matching "{searchState.query}"</span>
                )}
              </span>
            ) : (
              <span>Showing all {totalCount} credits</span>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-medium sm:hidden">Active filters:</span>
              <span className="text-xs hidden sm:inline">Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {searchState.query && (
                  <Badge variant="outline" className="text-xs transition-colors-smooth border-primary/30 text-primary">
                    <span className="sm:hidden">"{searchState.query.length > 15 ? searchState.query.substring(0, 15) + '...' : searchState.query}"</span>
                    <span className="hidden sm:inline">Search: {searchState.query}</span>
                  </Badge>
                )}
                {searchState.statusFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs transition-colors-smooth border-primary/30 text-primary">
                    <span className="sm:hidden">{searchState.statusFilter}</span>
                    <span className="hidden sm:inline">Status: {searchState.statusFilter}</span>
                  </Badge>
                )}
                {searchState.vintageFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs transition-colors-smooth border-primary/30 text-primary">
                    <span className="sm:hidden">{searchState.vintageFilter}</span>
                    <span className="hidden sm:inline">Vintage: {searchState.vintageFilter}</span>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
});

SearchFilters.displayName = "SearchFilters";

export { SearchFilters };