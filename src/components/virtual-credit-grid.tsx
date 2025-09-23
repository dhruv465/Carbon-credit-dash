import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { CreditCard } from "./credit-card";
import { EmptyState } from "./search/empty-state";
import { useIntersectionObserver } from "@/lib/performance";
import type { Credit } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VirtualCreditGridProps {
  credits: Credit[];
  onViewDetails?: (credit: Credit) => void;
  onDownloadCertificate?: (credit: Credit) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  searchQuery?: string;
  className?: string;
  itemsPerPage?: number;
  enableVirtualScrolling?: boolean;
  virtualScrollThreshold?: number;
}

/**
 * Performance-optimized credit grid with virtual scrolling for large datasets
 * Uses intersection observer and windowing techniques to maintain smooth performance
 * Addresses requirements: 6.1, 6.2, 6.3, 6.4 - Performance optimizations and virtual scrolling
 */
const VirtualCreditGrid = React.memo<VirtualCreditGridProps>(({ 
  credits, 
  onViewDetails, 
  onDownloadCertificate,
  hasActiveFilters = false,
  onClearFilters,
  searchQuery,
  className,
  itemsPerPage = 20,
  enableVirtualScrolling = true,
  virtualScrollThreshold = 100
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemsPerPage });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use intersection observer to detect when to load more items
  const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Determine if virtual scrolling should be enabled based on dataset size
  const shouldUseVirtualScrolling = enableVirtualScrolling && credits.length > virtualScrollThreshold;

  // Memoize visible credits to prevent unnecessary recalculations
  const visibleCredits = useMemo(() => {
    if (!shouldUseVirtualScrolling) {
      return credits;
    }
    return credits.slice(visibleRange.start, visibleRange.end);
  }, [credits, visibleRange, shouldUseVirtualScrolling]);

  // Load more items when intersection observer triggers
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || visibleRange.end >= credits.length) {
      return;
    }

    setIsLoadingMore(true);
    
    // Simulate async loading with setTimeout to prevent blocking
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + itemsPerPage, credits.length)
      }));
      setIsLoadingMore(false);
    }, 100);
  }, [isLoadingMore, visibleRange.end, credits.length, itemsPerPage]);

  // Trigger loading more items when load more element becomes visible
  useEffect(() => {
    if (isLoadMoreVisible && shouldUseVirtualScrolling) {
      loadMoreItems();
    }
  }, [isLoadMoreVisible, loadMoreItems, shouldUseVirtualScrolling]);

  // Reset visible range when credits change (e.g., after filtering)
  useEffect(() => {
    setVisibleRange({ start: 0, end: Math.min(itemsPerPage, credits.length) });
  }, [credits.length, itemsPerPage]);

  // Optimized scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (!shouldUseVirtualScrolling || !containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const itemHeight = 300; // Approximate height of a credit card
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 5, // Buffer of 5 items
      credits.length
    );

    if (startIndex !== visibleRange.start || endIndex !== visibleRange.end) {
      setVisibleRange({ start: startIndex, end: endIndex });
    }
  }, [shouldUseVirtualScrolling, visibleRange, credits.length]);

  // Throttled scroll event listener
  useEffect(() => {
    if (!shouldUseVirtualScrolling) return;

    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout | undefined;
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, shouldUseVirtualScrolling]);

  if (credits.length === 0) {
    return (
      <EmptyState
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters || (() => {})}
        searchQuery={searchQuery}
        className={className}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("space-y-8", className)}
      style={{ 
        height: shouldUseVirtualScrolling ? '600px' : 'auto',
        overflowY: shouldUseVirtualScrolling ? 'auto' : 'visible'
      }}
    >
      {/* Virtual scrolling spacer for items before visible range */}
      {shouldUseVirtualScrolling && visibleRange.start > 0 && (
        <div 
          style={{ height: `${visibleRange.start * 300}px` }}
          aria-hidden="true"
        />
      )}

      {/* Credit Grid */}
      <div 
        className={cn(
          // Responsive grid layout with optimized spacing
          "grid gap-4 sm:gap-6",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
          "2xl:grid-cols-4 2xl:gap-8",
          "w-full",
          "transition-all duration-200 ease-in-out"
        )}
        role="grid"
        aria-label={`Carbon credits grid showing ${visibleCredits.length} of ${credits.length} credits`}
        aria-live="polite"
        aria-atomic="false"
      >
        {visibleCredits.map((credit, index) => {
          const actualIndex = shouldUseVirtualScrolling ? visibleRange.start + index : index;
          return (
            <div 
              key={credit.unic_id} 
              role="gridcell"
              aria-rowindex={Math.floor(actualIndex / 4) + 1}
              aria-colindex={(actualIndex % 4) + 1}
            >
              <CreditCard
                credit={credit}
                onViewDetails={onViewDetails}
                onDownloadCertificate={onDownloadCertificate}
              />
            </div>
          );
        })}
      </div>

      {/* Virtual scrolling spacer for items after visible range */}
      {shouldUseVirtualScrolling && visibleRange.end < credits.length && (
        <div 
          style={{ height: `${(credits.length - visibleRange.end) * 300}px` }}
          aria-hidden="true"
        />
      )}

      {/* Load more trigger for intersection observer */}
      {shouldUseVirtualScrolling && visibleRange.end < credits.length && (
        <div 
          ref={loadMoreRef}
          className="flex items-center justify-center py-4"
          aria-live="polite"
        >
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              <span>Loading more credits...</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {visibleRange.end} of {credits.length} credits
            </div>
          )}
        </div>
      )}
    </div>
  );
});

VirtualCreditGrid.displayName = "VirtualCreditGrid";

export { VirtualCreditGrid };