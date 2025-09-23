import React, { memo, type ComponentType } from 'react';

/**
 * Performance optimization utilities for React components
 * Addresses requirements: 6.1, 6.2, 6.3 - Performance optimizations
 */

/**
 * Higher-order component for memoizing components with custom comparison
 * Useful for complex props that need custom equality checks
 */
export function withMemo<T extends object>(
  Component: ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
): ComponentType<T> {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Custom comparison function for credit objects
 * Optimizes re-renders by doing shallow comparison of credit properties
 */
export function areCreditsEqual(
  prevCredits: any[],
  nextCredits: any[]
): boolean {
  if (prevCredits.length !== nextCredits.length) {
    return false;
  }
  
  return prevCredits.every((prevCredit, index) => {
    const nextCredit = nextCredits[index];
    return (
      prevCredit.unic_id === nextCredit.unic_id &&
      prevCredit.project_name === nextCredit.project_name &&
      prevCredit.vintage === nextCredit.vintage &&
      prevCredit.status === nextCredit.status
    );
  });
}

/**
 * Custom comparison function for search state objects
 * Prevents unnecessary re-renders when search state hasn't actually changed
 */
export function areSearchStatesEqual(
  prevState: any,
  nextState: any
): boolean {
  return (
    prevState.query === nextState.query &&
    prevState.statusFilter === nextState.statusFilter &&
    prevState.vintageFilter === nextState.vintageFilter &&
    prevState.sortBy === nextState.sortBy &&
    prevState.sortOrder === nextState.sortOrder
  );
}

/**
 * Performance monitoring hook for development
 * Helps identify components that re-render frequently
 */
export function useRenderCount(componentName: string): void {
  if (process.env.NODE_ENV === 'development') {
    const renderCount = React.useRef(0);
    renderCount.current += 1;
    
    React.useEffect(() => {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    });
  }
}

/**
 * Debounced callback hook for performance optimization
 * Prevents excessive function calls during rapid user interactions
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  
  return React.useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttled callback hook for performance optimization
 * Limits function execution to once per specified interval
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = React.useRef<number>(0);
  
  return React.useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook for lazy loading and performance
 * Useful for implementing virtual scrolling or lazy loading of components
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);
  
  return isIntersecting;
}