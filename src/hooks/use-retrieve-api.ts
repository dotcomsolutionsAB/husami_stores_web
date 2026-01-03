import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export interface RetrievePayload {
  limit: number;
  offset: number;
  search: string;
  [key: string]: any;
}

export interface PaginationData {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

export interface RetrieveResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T[];
  pagination: PaginationData;
}

export interface UseRetrieveApiOptions<P extends RetrievePayload> {
  mutationHook: any;
  payload: P;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseRetrieveApiResult<T> {
  data: T[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export function useRetrieveApi<T, P extends RetrievePayload>({
  mutationHook,
  payload,
  debounceMs = 500,
  enabled = true,
}: UseRetrieveApiOptions<P>): UseRetrieveApiResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(payload.search);

  const [mutationFn, { isLoading }] = mutationHook();

  // Create a payload without search for dependency tracking (search is debounced separately)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { search: _, ...payloadWithoutSearch } = payload;
  const payloadDepsString = JSON.stringify(payloadWithoutSearch);

  // Debounce search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(payload.search);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [payload.search, debounceMs]);

  // Fetch data when debounced search or other payload properties change
  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setError(null);
        const response = await mutationFn({
          ...payload,
          search: debouncedSearch,
        }).unwrap();

        if (response.code === 200 && response.status === 'success') {
          setData(response.data || []);
          setPagination(response.pagination || null);
        } else {
          throw new Error(response.message || 'Failed to fetch data');
        }
      } catch (err: any) {
        // Error already handled by apiSlice globally
        const errorMessage = err?.data?.message || err?.message || 'Failed to fetch data';
        setError(err instanceof Error ? err : new Error(errorMessage));
        setData([]);
        setPagination(null);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationFn, debouncedSearch, payloadDepsString, enabled]);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const response = await mutationFn({
        ...payload,
        search: debouncedSearch,
      }).unwrap();

      if (response.code === 200 && response.status === 'success') {
        setData(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (err: any) {
      // Error already handled by apiSlice globally
      const errorMessage = err?.data?.message || err?.message || 'Failed to fetch data';
      setError(err instanceof Error ? err : new Error(errorMessage));
      setData([]);
      setPagination(null);
    }
  }, [mutationFn, payload, debouncedSearch, enabled]);

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch,
  };
}
