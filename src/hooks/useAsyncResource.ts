import { useEffect, useState } from 'react';

export function useAsyncResource<T>(loader: () => Promise<T>, deps: React.DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    void loader()
      .then((next) => {
        if (!cancelled) {
          setData(next);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, isLoading };
}
