import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLoadingProps {
  className?: string;
  showSearch?: boolean;
  showStats?: boolean;
  creditCount?: number;
}

/**
 * Modern comprehensive loading state for the entire dashboard
 * Provides optimized loading experience with staggered animations and shimmer effects
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
      className={cn("space-y-8 animate-in fade-in-0 duration-500", className)}
      role="status"
      aria-label="Loading dashboard"
      aria-live="polite"
    >
      {/* Modern loading header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <Activity className="absolute inset-0 m-auto h-5 w-5 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Fetching your carbon credit data...</p>
          </div>
        </div>
        <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* Enhanced stats cards skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
              </CardContent>
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{ animationDelay: `${index * 200}ms` }}
              ></div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick stats bar skeleton */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </Card>

      {/* Search skeleton */}
      {showSearch && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      )}

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: creditCount }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </CardContent>
            <div 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ animationDelay: `${i * 100}ms` }}
            ></div>
          </Card>
        ))}
      </div>
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
 * Modern inline loading component with Lucide icons
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
    md: "h-5 w-5", 
    lg: "h-6 w-6"
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
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
});

InlineLoading.displayName = "InlineLoading";

interface ButtonLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modern loading state specifically for buttons using Lucide icons
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
    <Loader2 
      className={cn(
        "animate-spin",
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

/**
 * Full page loading component for initial app load
 */
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          <Activity className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">EcoOffset Dashboard</h2>
          <p className="text-muted-foreground">Loading your carbon credit portfolio...</p>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardLoading, InlineLoading, ButtonLoading };