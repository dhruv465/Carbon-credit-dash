import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCredits, transformCreditsWithMetadata, calculateDashboardStats } from '@/lib/data';
import { withRetry, handleError, AppError, NetworkMonitor } from '@/lib/error-handling';
import type { CreditWithMetadata, DashboardStats, UseCreditsReturn } from '@/lib/types';

/**
 * Custom hook for managing credit data with loading states and error handling
 * Enhanced with performance optimizations including memoization
 * Addresses requirements: 1.1, 6.1, 6.2, 6.3
 */
export function useCredits(): UseCreditsReturn {
  const [credits, setCredits] = useState<CreditWithMetadata[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 0,
    activeCredits: 0,
    retiredCredits: 0,
    vintageRange: { min: 0, max: 0 },
    availableVintages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use retry mechanism with network monitoring
      const rawCredits = await withRetry(
        async () => {
          // Check network status before attempting
          const networkMonitor = NetworkMonitor.getInstance();
          if (!networkMonitor.getStatus()) {
            throw new AppError(
              'No internet connection',
              { component: 'useCredits', action: 'loadCredits' },
              true,
              'Please check your internet connection and try again.'
            );
          }
          
          return await getCredits();
        },
        {
          maxAttempts: 3,
          delay: 1000,
          backoff: true,
          onRetry: (attempt: number, error: Error) => {
            setRetryCount(attempt);
            console.log(`Retry attempt ${attempt} for loading credits:`, error.message);
          }
        }
      );
      
      const creditsWithMetadata = transformCreditsWithMetadata(rawCredits);
      const dashboardStats = calculateDashboardStats(rawCredits);
      
      setCredits(creditsWithMetadata);
      setStats(dashboardStats);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const appError = err instanceof AppError 
        ? err 
        : new AppError(
            err instanceof Error ? err.message : 'Failed to load credits',
            { component: 'useCredits', action: 'loadCredits' },
            true
          );
      
      setError(appError.userMessage);
      handleError(appError, {}, false); // Don't show toast here, let UI handle it
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await loadCredits();
  }, [loadCredits]);

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    credits,
    stats,
    loading,
    error,
    refetch,
    retryCount,
  }), [credits, stats, loading, error, refetch, retryCount]);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  return returnValue;
}