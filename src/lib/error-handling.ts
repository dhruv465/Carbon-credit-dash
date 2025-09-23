import { toast } from "sonner";

/**
 * Comprehensive error handling utilities for the carbon credits dashboard
 * Addresses requirements 6.1 and 6.5 for robust error recovery and user feedback
 */

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

/**
 * Enhanced error class with context information
 */
export class AppError extends Error {
  public readonly context: ErrorContext;
  public readonly isRetryable: boolean;
  public readonly userMessage: string;

  constructor(
    message: string,
    context: ErrorContext = {},
    isRetryable: boolean = false,
    userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.context = {
      ...context,
      timestamp: new Date().toISOString(),
    };
    this.isRetryable = isRetryable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
  }

  private getDefaultUserMessage(): string {
    if (this.message.includes('network') || this.message.includes('fetch')) {
      return 'Network error occurred. Please check your connection and try again.';
    }
    if (this.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (this.message.includes('certificate')) {
      return 'Certificate generation failed. Please try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Network error detection utility
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('timeout') ||
    error.message.includes('Failed to fetch') ||
    error.name === 'TypeError' && error.message.includes('fetch')
  );
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if error is retryable
      if (error instanceof AppError && !error.isRetryable) {
        break;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Calculate delay with optional exponential backoff
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError!;
}

/**
 * Enhanced error handler with toast notifications and logging
 */
export function handleError(
  error: Error | AppError,
  context: ErrorContext = {},
  showToast: boolean = true
): void {
  const appError = error instanceof AppError 
    ? error 
    : new AppError(error.message, context, isNetworkError(error));

  // Log error for debugging
  console.error('Error handled:', {
    message: appError.message,
    context: appError.context,
    stack: appError.stack,
    isRetryable: appError.isRetryable,
  });

  // Show toast notification if requested
  if (showToast) {
    toast.error(appError.userMessage, {
      description: appError.context.action ? `Action: ${appError.context.action}` : undefined,
      action: appError.isRetryable ? {
        label: 'Retry',
        onClick: () => {
          // Emit custom event for retry handling
          window.dispatchEvent(new CustomEvent('error-retry', {
            detail: { error: appError, context: appError.context }
          }));
        }
      } : undefined,
    });
  }

  // In production, you might want to send errors to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToLoggingService(appError);
  }
}

/**
 * Async error handler for promises
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  context: ErrorContext = {},
  showToast: boolean = true
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      context,
      showToast
    );
    return null;
  }
}

/**
 * Error boundary helper for functional components
 */
export function createErrorHandler(componentName: string) {
  return (error: Error, errorInfo?: any) => {
    handleError(error, {
      component: componentName,
      additionalData: errorInfo,
    });
  };
}

/**
 * Network status monitoring
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<(isOnline: boolean) => void> = new Set();

  private constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notifyListeners();
    toast.success('Connection restored', {
      description: 'You are back online',
    });
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners();
    toast.error('Connection lost', {
      description: 'Please check your internet connection',
      duration: Infinity, // Keep showing until back online
    });
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public addListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

/**
 * Utility to wrap async operations with comprehensive error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: Omit<ErrorContext, 'timestamp'> = {}
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(String(error)),
        context
      );
      return null;
    }
  };
}