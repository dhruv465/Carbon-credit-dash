import { useEffect } from 'react';
import { handleError, AppError } from '@/lib/error-handling';

/**
 * Global error handler component that catches unhandled errors and promise rejections
 * Provides centralized error handling for the entire application
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new AppError(
        event.error?.message || event.message || 'Unknown error occurred',
        {
          component: 'GlobalErrorHandler',
          action: 'handleGlobalError',
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
          }
        },
        false,
        'An unexpected error occurred. The page may need to be refreshed.'
      );

      handleError(error);
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new AppError(
        event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
        {
          component: 'GlobalErrorHandler',
          action: 'handleUnhandledRejection',
          additionalData: {
            reason: event.reason,
            stack: event.reason?.stack,
          }
        },
        false,
        'An unexpected error occurred. Please try refreshing the page.'
      );

      handleError(error);
      
      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

/**
 * Enhanced error boundary with better error reporting
 */
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Handle error with our error handling system
    const appError = new AppError(
      error.message,
      {
        component: 'EnhancedErrorBoundary',
        action: 'componentDidCatch',
        additionalData: {
          errorInfo,
          errorId: this.state.errorId,
          componentStack: errorInfo.componentStack,
        }
      },
      false,
      'A component error occurred. Please try refreshing the page.'
    );

    handleError(appError, {}, false); // Don't show toast, we'll show UI instead

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: ''
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default enhanced error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription className="text-base">
                An unexpected error occurred in the application. 
                You can try the actions below to resolve the issue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              <div className="bg-muted p-3 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Error ID</p>
                <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                  {this.state.errorId}
                </code>
              </div>

              {/* Error details in development */}
              {(import.meta.env.DEV || this.props.showErrorDetails) && this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-muted-foreground mb-2">
                    Technical Details (Development)
                  </summary>
                  <div className="bg-muted p-3 rounded text-xs font-mono overflow-auto max-h-40 space-y-2">
                    <div>
                      <span className="text-red-600 font-semibold">Error:</span>
                      <div className="text-foreground mt-1">
                        {this.state.error.name}: {this.state.error.message}
                      </div>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <span className="text-blue-600 font-semibold">Stack Trace:</span>
                        <pre className="text-muted-foreground mt-1 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <span className="text-green-600 font-semibold">Component Stack:</span>
                        <pre className="text-muted-foreground mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleGoHome} 
                  size="sm"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Support information */}
              <div className="text-center text-sm text-muted-foreground">
                <p>If this problem persists, please contact support with the Error ID above.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}