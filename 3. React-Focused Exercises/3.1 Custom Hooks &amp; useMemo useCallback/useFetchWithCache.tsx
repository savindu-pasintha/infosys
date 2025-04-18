import { useState, useEffect, useMemo, useCallback } from 'react';

const cache: Record<string, any> = {};

export function useFetchWithCache<T = any>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const [error, setError] = useState<string | null>(null);

  const memoizedUrl = useMemo(() => url, [url]);

  const fetchData = useCallback(async () => {
    if (!memoizedUrl) return;

    if (cache[memoizedUrl]) {
      setData(cache[memoizedUrl]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(memoizedUrl);
      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();
      cache[memoizedUrl] = result;
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [memoizedUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}
