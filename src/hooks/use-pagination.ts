import { useState, useMemo, useCallback } from "react";

export interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  getPageItems: <T>(items: T[]) => T[];
  paginationInfo: {
    showingFrom: number;
    showingTo: number;
    totalItems: number;
  };
}

/**
 * Custom hook for managing pagination state and logic
 * Provides comprehensive pagination functionality with performance optimizations
 * Addresses requirement: 6.2, 6.4 - Performance with large datasets
 */
export function usePagination({
  totalItems,
  itemsPerPage = 12,
  initialPage = 1
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPageState] = useState(initialPage);

  // Calculate derived values
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const paginationInfo = useMemo(() => {
    return {
      showingFrom: totalItems > 0 ? startIndex + 1 : 0,
      showingTo: endIndex,
      totalItems
    };
  }, [startIndex, endIndex, totalItems]);

  // Safe page setter that ensures page is within bounds
  const setCurrentPage = useCallback((page: number) => {
    const safePage = Math.max(1, Math.min(page, totalPages));
    setCurrentPageState(safePage);
  }, [totalPages]);

  // Navigation functions
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, hasNextPage, setCurrentPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, hasPreviousPage, setCurrentPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages, setCurrentPage]);

  // Function to get paginated items from an array
  const getPageItems = useCallback(<T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  // Reset to first page when total items change significantly
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPageState(1);
    }
  }, [totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    setCurrentPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    getPageItems,
    paginationInfo
  };
}

/**
 * Generate pagination items for UI rendering
 * Handles ellipsis and smart page number display
 */
export function generatePaginationItems(
  currentPage: number, 
  totalPages: number, 
  maxVisiblePages: number = 5
): (number | '...')[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | '...')[] = [];
  
  if (currentPage <= 3) {
    // Show first pages: 1, 2, 3, 4, ..., last
    for (let i = 1; i <= Math.min(4, totalPages - 1); i++) {
      items.push(i);
    }
    if (totalPages > 4) {
      items.push('...');
    }
    items.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    // Show last pages: 1, ..., last-3, last-2, last-1, last
    items.push(1);
    if (totalPages > 4) {
      items.push('...');
    }
    for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
      items.push(i);
    }
  } else {
    // Show middle pages: 1, ..., current-1, current, current+1, ..., last
    items.push(1);
    items.push('...');
    items.push(currentPage - 1);
    items.push(currentPage);
    items.push(currentPage + 1);
    items.push('...');
    items.push(totalPages);
  }

  return items;
}