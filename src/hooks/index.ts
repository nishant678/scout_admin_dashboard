import { useCallback, useState, useEffect } from 'react';
import type { FilterState } from '../types';

/**
 * Hook for managing filter state
 */
export const useFilter = (initialState: Partial<FilterState> = {}) => {
  const [filter, setFilter] = useState<FilterState>({
    searchTerm: initialState.searchTerm || '',
    status: initialState.status,
    category: initialState.category,
    dateRange: initialState.dateRange,
  });

  const updateFilter = useCallback((updates: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter({
      searchTerm: '',
      status: undefined,
      category: undefined,
      dateRange: undefined,
    });
  }, []);

  return { filter, updateFilter, resetFilter };
};

/**
 * Hook for managing pagination
 */
export const usePagination = (totalItems: number, pageSize: number = 10) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
  };
};

/**
 * Hook for managing loading state
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  return { isLoading, start, stop };
};

/**
 * Hook for managing async operations
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};

/**
 * Hook for debouncing values
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
