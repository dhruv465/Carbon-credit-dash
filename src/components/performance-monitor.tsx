import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  enabled?: boolean;
  showInProduction?: boolean;
  className?: string;
}

/**
 * Development performance monitoring component
 * Tracks render counts, timing, and memory usage for performance optimization
 * Addresses requirements: 6.1, 6.2, 6.3 - Performance monitoring and optimization
 */
const PerformanceMonitor = React.memo<PerformanceMonitorProps>(({
  componentName,
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false,
  className
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  
  const renderStartTime = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);
  const previousRenderCount = useRef<number>(0);

  // Don't render in production unless explicitly enabled
  if (!enabled && !showInProduction) {
    return null;
  }

  // Track render performance
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    renderTimes.current.push(renderTime);
    
    // Keep only last 10 render times for average calculation
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined,
    }));
  });

  // Record render start time
  renderStartTime.current = performance.now();

  // Log performance warnings
  useEffect(() => {
    if (metrics.renderCount > previousRenderCount.current) {
      if (metrics.lastRenderTime > 16) { // More than one frame (60fps)
        console.warn(`${componentName}: Slow render detected (${metrics.lastRenderTime.toFixed(2)}ms)`);
      }
      
      if (metrics.renderCount > 50) {
        console.warn(`${componentName}: High render count detected (${metrics.renderCount} renders)`);
      }
      
      previousRenderCount.current = metrics.renderCount;
    }
  }, [metrics, componentName]);

  const formatMemory = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getRenderPerformanceColor = (time: number): string => {
    if (time < 8) return 'text-green-600';
    if (time < 16) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={cn(
          "fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100",
          "bg-background/80 backdrop-blur-sm",
          className
        )}
        aria-label={`Show performance metrics for ${componentName}`}
      >
        📊 {componentName}
      </Button>
    );
  }

  return (
    <Card 
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80",
        "bg-background/95 backdrop-blur-sm border-border/50",
        "shadow-lg",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Performance: {componentName}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
            aria-label="Hide performance metrics"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Renders:</span>
              <Badge variant="outline" className="text-xs">
                {metrics.renderCount}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last:</span>
              <span className={getRenderPerformanceColor(metrics.lastRenderTime)}>
                {metrics.lastRenderTime.toFixed(1)}ms
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg:</span>
              <span className={getRenderPerformanceColor(metrics.averageRenderTime)}>
                {metrics.averageRenderTime.toFixed(1)}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory:</span>
              <span className="text-xs">
                {formatMemory(metrics.memoryUsage)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMetrics({
                  renderCount: 0,
                  lastRenderTime: 0,
                  averageRenderTime: 0,
                });
                renderTimes.current = [];
                previousRenderCount.current = 0;
              }}
              className="text-xs h-6"
            >
              Reset
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log(`Performance metrics for ${componentName}:`, metrics);
              }}
              className="text-xs h-6"
            >
              Log
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

/**
 * Hook for tracking component performance metrics
 * Provides render count and timing information for optimization
 */
export function usePerformanceMetrics(componentName: string) {
  const renderCount = useRef(0);
  const renderStartTime = useRef(0);
  const renderTimes = useRef<number[]>([]);
  
  // Record render start
  renderStartTime.current = performance.now();
  renderCount.current += 1;
  
  useEffect(() => {
    // Record render end
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    renderTimes.current.push(renderTime);
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    // Log performance warnings in development
    if (process.env.NODE_ENV === 'development') {
      if (renderTime > 16) {
        console.warn(`${componentName}: Slow render (${renderTime.toFixed(2)}ms)`);
      }
      
      if (renderCount.current % 25 === 0) {
        const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
        console.log(`${componentName}: ${renderCount.current} renders, avg ${avgRenderTime.toFixed(2)}ms`);
      }
    }
  });
  
  return {
    renderCount: renderCount.current,
    averageRenderTime: renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0
  };
}

export { PerformanceMonitor };