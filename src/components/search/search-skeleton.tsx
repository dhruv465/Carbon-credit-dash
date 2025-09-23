import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SearchSkeletonProps {
  className?: string;
  showFilters?: boolean;
}

/**
 * Loading skeleton for search and filter components
 * Provides visual feedback during search operations for better perceived performance
 * Addresses requirements: 6.2, 6.5 - Loading states and skeleton screens
 */
const SearchSkeleton = React.memo<SearchSkeletonProps>(({ 
  className,
  showFilters = true
}) => {
  return (
    <section 
      className={cn("space-y-4 animate-in fade-in-0 duration-200", className)}
      role="status"
      aria-label="Loading search interface"
      aria-live="polite"
    >
      {/* Search and Filter Controls Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          {/* Search bar skeleton */}
          <div className="relative">
            <Skeleton className="h-10 w-full rounded-md" />
            {/* Search icon placeholder */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            {/* Status filter skeleton */}
            <Skeleton className="h-10 w-[120px] rounded-md" />
            
            {/* Vintage filter skeleton */}
            <Skeleton className="h-10 w-[130px] rounded-md" />
            
            {/* Clear filters button skeleton */}
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        )}
      </div>

      {/* Results Summary Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
});

SearchSkeleton.displayName = "SearchSkeleton";

export { SearchSkeleton };