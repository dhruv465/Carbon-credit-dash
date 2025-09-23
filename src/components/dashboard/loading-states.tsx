import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditGridSkeleton } from "@/components/credit-grid-skeleton";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import { cn } from "@/lib/utils";

interface DashboardLoadingProps {
  className?: string;
  showSearch?: boolean;
  showStats?: boolean;
  creditCount?: number;
}

/**
 * Comprehensive loading state for the entire dashboard
 * Provides optimized loading experience with staggered animations
 * Addresses requirements: 6.1, 6.2, 6.5 - Performance and loading states
 */
const DashboardLoading = React.memo<DashboardLoadingProps>(({ 
  className,
  showSearch = true,
  showStats = true,
  creditCount = 12
}) => {
  return (
    <div 
      className={cn("space-y-8 animate-in fade-in-0 duration-300", className)}
      role="status"
      aria-label="Loading dashboard"
      aria-live="polite"
    >
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" /> {/* Dashboard title */}
        
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg space-y-2 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Skeleton */}
      {showSearch && <SearchSkeleton />}

      {/* Credit Grid Skeleton */}
      <CreditGridSkeleton count={creditCount} showShimmer />
    </div>
  );
});

DashboardLoading.displayName = "DashboardLoading";

interface InlineLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

/**
 * Inline loading component for smaller loading states
 * Optimized for performance with minimal re-renders
 * Addresses requirements: 6.2, 6.5 - Loading states
 */
const InlineLoading = React.memo<InlineLoadingProps>(({ 
  className,
  size = 'md',
  text = "Loading..."
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        className
      )}
      role="status"
      aria-label={text}
    >
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="text-sm">{text}</span>
    </div>
  );
});

InlineLoading.displayName = "InlineLoading";

interface ButtonLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Loading state specifically for buttons
 * Maintains button dimensions while showing loading state
 * Addresses requirements: 6.2, 6.5 - Loading states
 */
const ButtonLoading = React.memo<ButtonLoadingProps>(({ 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
      aria-hidden="true"
    />
  );
});

ButtonLoading.displayName = "ButtonLoading";

export { DashboardLoading, InlineLoading, ButtonLoading };