import { useEffect, useRef } from 'react';

export const useInfiniteScrollSentinel = (hasNext: boolean, onLoadMore: () => void) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onLoadMore();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNext, onLoadMore]);

  return sentinelRef;
};
