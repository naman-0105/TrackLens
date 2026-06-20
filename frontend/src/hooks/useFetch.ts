import { useCallback, useEffect, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const [loading, setLoading] = useState(true);

  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runFetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetcher();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Something went wrong"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    runFetch();

    return () => {
      cancelled = true;
    };

  }, [...deps, reloadToken]);

  return {
    data,
    error,
    loading,
    reload,
  };
}
