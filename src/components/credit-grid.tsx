import React from "react";
import { CreditCard } from "./credit-card";
import { EmptyState } from "./search/empty-state";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { usePagination, generatePaginationItems } from "@/hooks/use-pagination";
import type { Credit } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreditGridProps {
  credits: Credit[];
  onViewDetails?: (credit: Credit) => void;
  onDownloadCertificate?: (credit: Credit) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  searchQuery?: string;
  className?: string;
  itemsPerPage?: number;
}

const CreditGrid = React.memo<CreditGridProps>(({ 
  credits, 
  onViewDetails, 
  onDownloadCertificate,
  hasActiveFilters = false,
  onClearFilters,
  searchQuery,
  className,
  itemsPerPage = 12
}) => {
  // Use pagination hook for state management
  const pagination = usePagination({
    totalItems: credits.length,
    itemsPerPage,
    initialPage: 1
  });

  const paginatedCredits = pagination.getPageItems(credits);
  const showPagination = credits.length > itemsPerPage;
  
  // Generate pagination items for UI
  const paginationItems = generatePaginationItems(
    pagination.currentPage, 
    pagination.totalPages
  );

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
    <div className={cn("space-y-8 animate-fade-in", className)}>
      {/* Credit Grid */}
      <div 
        className={cn(
          // Responsive grid layout with optimized spacing and consistent heights
          "grid gap-4 sm:gap-5 lg:gap-6",
          // Mobile: 1 column with full width
          "grid-cols-1",
          // Small tablet: 2 columns (640px+)
          "sm:grid-cols-2",
          // Large tablet/small desktop: 3 columns (1024px+)
          "lg:grid-cols-3",
          // Large desktop: 4 columns (1280px+)
          "xl:grid-cols-4",
          // Extra large screens: maintain max 4 columns with better spacing
          "2xl:grid-cols-4 2xl:gap-8",
          // Ensure proper alignment and spacing
          "w-full",
          // Auto-fit grid rows to accommodate fixed height cards
          "auto-rows-fr",
          // Mobile-specific optimizations
          "px-1 sm:px-0", // Slight padding on mobile for better edge spacing
          // Add subtle animation for grid changes
          "transition-smooth animate-slide-up"
        )}
        role="grid"
        aria-label={`Carbon credits grid showing ${paginatedCredits.length} of ${credits.length} credits`}
        aria-live="polite"
        aria-atomic="false"
      >
        {paginatedCredits.map((credit, index) => (
          <div 
            key={credit.unic_id} 
            role="gridcell"
            aria-rowindex={Math.floor(index / 4) + 1}
            aria-colindex={(index % 4) + 1}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CreditCard
              credit={credit}
              onViewDetails={onViewDetails}
              onDownloadCertificate={onDownloadCertificate}
            />
          </div>
        ))}
      </div>

      {/* Pagination - Mobile Optimized */}
      {showPagination && (
        <nav 
          className="flex flex-col items-center space-y-3 sm:space-y-4 animate-slide-up px-2 sm:px-0" 
          role="navigation" 
          aria-label="Credit grid pagination"
        >
          {/* Results summary */}
          <div 
            className="text-sm sm:text-base text-muted-foreground text-center font-medium"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="block sm:inline">
              Showing {pagination.paginationInfo.showingFrom} to{' '}
              {pagination.paginationInfo.showingTo}
            </span>
            <span className="block sm:inline sm:ml-1">
              of {pagination.paginationInfo.totalItems} credits
            </span>
          </div>

          {/* Pagination controls - Touch-friendly */}
          <Pagination>
            <PaginationContent className="gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.previousPage();
                  }}
                  className={cn(
                    "h-10 sm:h-9 px-3 sm:px-4 text-sm font-medium",
                    "touch-manipulation active:scale-95",
                    !pagination.hasPreviousPage 
                      ? "pointer-events-none opacity-50" 
                      : "focus-ring-enhanced transition-smooth hover:text-primary"
                  )}
                  aria-disabled={!pagination.hasPreviousPage}
                  aria-label={`Go to previous page${!pagination.hasPreviousPage ? ' (disabled)' : ''}`}
                />
              </PaginationItem>

              {paginationItems.map((item, index) => (
                <PaginationItem key={index}>
                  {item === '...' ? (
                    <PaginationEllipsis aria-label="More pages" className="h-10 sm:h-9" />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.setCurrentPage(item as number);
                      }}
                      isActive={pagination.currentPage === item}
                      className={cn(
                        "h-10 w-10 sm:h-9 sm:w-9 text-sm font-medium",
                        "touch-manipulation active:scale-95",
                        "focus-ring-enhanced transition-smooth hover:text-primary"
                      )}
                      aria-label={`Go to page ${item}${pagination.currentPage === item ? ' (current page)' : ''}`}
                      aria-current={pagination.currentPage === item ? 'page' : undefined}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.nextPage();
                  }}
                  className={cn(
                    "h-10 sm:h-9 px-3 sm:px-4 text-sm font-medium",
                    "touch-manipulation active:scale-95",
                    !pagination.hasNextPage 
                      ? "pointer-events-none opacity-50" 
                      : "focus-ring-enhanced transition-smooth hover:text-primary"
                  )}
                  aria-disabled={!pagination.hasNextPage}
                  aria-label={`Go to next page${!pagination.hasNextPage ? ' (disabled)' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>
      )}
    </div>
  );
});

CreditGrid.displayName = "CreditGrid";

export { CreditGrid };