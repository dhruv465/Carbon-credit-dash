import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CreditGridSkeletonProps {
  count?: number;
  className?: string;
  showShimmer?: boolean;
}

/**
 * Enhanced loading skeleton for credit grid with shimmer effects and performance optimizations
 * Provides visual feedback during data loading for better perceived performance
 * Uses React.memo and optimized animations to reduce unnecessary re-renders
 * Addresses requirements: 6.1, 6.2, 6.3, 6.5 - Performance and loading states
 */
const CreditGridSkeleton = React.memo<CreditGridSkeletonProps>(({ 
  count = 12, 
  className,
  showShimmer = true
}) => {
  return (
    <div 
      className={cn(
        // Match the same responsive grid layout as CreditGrid
        "grid gap-4 sm:gap-6",
        "grid-cols-1",
        "sm:grid-cols-2", 
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        "2xl:grid-cols-4 2xl:gap-8",
        "w-full",
        // Add subtle animation for better perceived performance
        "animate-in fade-in-0 duration-300",
        className
      )}
      role="status"
      aria-label="Loading carbon credits"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card 
          key={index} 
          className={cn(
            "overflow-hidden border-border/50",
            // Stagger animation for better visual effect
            showShimmer && "animate-pulse",
            // Add slight delay for each card to create wave effect
            showShimmer && `animation-delay-${(index % 4) * 100}`
          )}
          style={{
            animationDelay: showShimmer ? `${(index % 4) * 100}ms` : undefined
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              {/* Project name skeleton with varied widths for realism */}
              <Skeleton className={cn(
                "h-6",
                index % 3 === 0 ? "w-3/4" : index % 3 === 1 ? "w-2/3" : "w-4/5"
              )} />
              {/* Status badge skeleton */}
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <div className="space-y-2">
              {/* UNIC ID row */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className={cn(
                  "h-6 rounded",
                  // Vary UNIC ID width slightly for realism
                  index % 2 === 0 ? "w-32" : "w-28"
                )} />
              </div>
              {/* Vintage row */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 gap-2">
            {/* Action buttons skeleton */}
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
});

CreditGridSkeleton.displayName = "CreditGridSkeleton";

/**
 * Compact skeleton for smaller loading states with enhanced performance optimization
 * Uses React.memo to prevent unnecessary re-renders during loading states
 * Addresses requirements: 6.1, 6.2, 6.3, 6.5 - Performance and loading states
 */
const CreditGridSkeletonCompact = React.memo<CreditGridSkeletonProps>(({ 
  count = 6, 
  className,
  showShimmer = true
}) => {
  return (
    <div 
      className={cn(
        "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "animate-in fade-in-0 duration-200",
        className
      )}
      role="status"
      aria-label="Loading carbon credits"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={cn(
            "p-4 border rounded-lg space-y-3 border-border/50",
            showShimmer && "animate-pulse"
          )}
          style={{
            animationDelay: showShimmer ? `${(index % 3) * 150}ms` : undefined
          }}
        >
          <div className="flex justify-between items-start">
            <Skeleton className={cn(
              "h-5",
              index % 2 === 0 ? "w-2/3" : "w-3/4"
            )} />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className={cn(
              "h-4",
              index % 2 === 0 ? "w-1/2" : "w-2/3"
            )} />
          </div>
        </div>
      ))}
    </div>
  );
});

CreditGridSkeletonCompact.displayName = "CreditGridSkeletonCompact";

export { CreditGridSkeleton, CreditGridSkeletonCompact };