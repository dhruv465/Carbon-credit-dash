import React from "react";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  searchQuery?: string;
  className?: string;
}

/**
 * Empty state component for no search results scenarios
 * Addresses requirements: 3.4, 6.3 (performance optimization with React.memo)
 */
const EmptyState = React.memo<EmptyStateProps>(({ 
  hasActiveFilters, 
  onClearFilters, 
  searchQuery,
  className = "" 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-muted p-4 mb-4 animate-scale-in transition-smooth" aria-hidden="true">
        <Search className="h-8 w-8 text-muted-foreground transition-colors-smooth" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2 animate-slide-up transition-colors-smooth">
        {hasActiveFilters ? "No credits found" : "No credits available"}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md animate-slide-up transition-colors-smooth" style={{ animationDelay: '100ms' }}>
        {hasActiveFilters ? (
          <>
            {searchQuery ? (
              <>No credits match your search for "{searchQuery}" and current filters.</>
            ) : (
              <>No credits match your current filters.</>
            )}
            {" "}Try adjusting your search criteria or clearing filters.
          </>
        ) : (
          "There are no carbon credits available to display at this time."
        )}
      </p>
      
      {hasActiveFilters && (
        <Button 
          onClick={onClearFilters}
          variant="outline"
          className="flex items-center gap-2 focus-ring-enhanced transition-smooth hover:border-primary/50 hover:text-primary animate-scale-in"
          style={{ animationDelay: '200ms' }}
          aria-label="Clear all active filters and show all credits"
        >
          <FilterX className="h-4 w-4" aria-hidden="true" />
          Clear all filters
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export { EmptyState };