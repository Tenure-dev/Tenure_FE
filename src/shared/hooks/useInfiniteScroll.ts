import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasMore,
  onLoadMore,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, rootMargin]);

  return sentinelRef;
};

export default useInfiniteScroll;
