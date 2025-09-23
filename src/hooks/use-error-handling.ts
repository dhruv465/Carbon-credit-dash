import { useCallback, useEffect, useState } from 'react';
import { handleError, AppError, NetworkMonitor, withRetry } from '@/lib/error-handling';
import type { ErrorContext, RetryOptions } from '@/lib/error-handling';

/**
 * Custom hook for comprehensive error handling in components
 * Provides utilities for error handling, retry logic, and network monitoring
 */
export function useErrorHandling(componentName: string) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastError, setLastError] = useState<AppError | null>(null);

  // Monitor network status
  useEffect(() => {
    const networkMonitor = NetworkMonitor.getInstance();
    const unsubscribe = networkMonitor.addListener(setIsOnline);
    setIsOnline(networkMonitor.getStatus());

    return unsubscribe;
  }, []);

  // Handle errors with context
  const handleComponentError = useCallback((
    error: Error | AppError,
    context: Omit<ErrorContext, 'component' | 'timestamp'> = {},
    showToast: boolean = true
  ) => {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(error.message, { component: componentName, ...context });
    
    setLastError(appError);
    handleError(appError, { component: componentName, ...context }, showToast);
  }, [componentName]);

  // Async operation wrapper with error handling
  const withErrorHandling = useCallback(<T>(
    asyncFn: () => Promise<T>,
    context: Omit<ErrorContext, 'component' | 'timestamp'> = {},
    showToast: boolean = true
  ): Promise<T | null> => {
    return asyncFn().catch((error) => {
      handleComponentError(error, context, showToast);
      return null;
    });
  }, [handleComponentError]);

  // Retry wrapper with error handling
  const withRetryAndErrorHandling = useCallback(<T>(
    asyncFn: () => Promise<T>,
    retryOptions: RetryOptions = {},
    context: Omit<ErrorContext, 'component' | 'timestamp'> = {},
    showToast: boolean = true
  ): Promise<T | null> => {
    return withRetry(asyncFn, retryOptions).catch((error) => {
      handleComponentError(error, context, showToast);
      return null;
    });
  }, [handleComponentError]);

  // Clear last error
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    isOnline,
    lastError,
    handleError: handleComponentError,
    withErrorHandling,
    withRetryAndErrorHandling,
    clearError,
  };
}

/**
 * Hook for handling async operations with loading states and error handling
 */
export function useAsyncOperation<T>(
  componentName: string,
  initialLoading: boolean = false
) {
  const [loading, setLoading] = useState(initialLoading);
  const [data, setData] = useState<T | null>(null);
  const { handleError, withRetryAndErrorHandling, isOnline, lastError, clearError } = useErrorHandling(componentName);

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    options: {
      retryOptions?: RetryOptions;
      context?: Omit<ErrorContext, 'component' | 'timestamp'>;
      showToast?: boolean;
      onSuccess?: (data: T) => void;
      onError?: (error: AppError) => void;
    } = {}
  ): Promise<T | null> => {
    const {
      retryOptions = {},
      context = {},
      showToast = true,
      onSuccess,
      onError
    } = options;

    setLoading(true);
    clearError();

    try {
      const result = await withRetryAndErrorHandling(
        asyncFn,
        retryOptions,
        context,
        showToast
      );

      if (result !== null) {
        setData(result);
        onSuccess?.(result);
        return result;
      } else {
        onError?.(lastError!);
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, [withRetryAndErrorHandling, clearError, lastError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    clearError();
  }, [clearError]);

  return {
    loading,
    data,
    error: lastError,
    isOnline,
    execute,
    reset,
    clearError,
  };
}