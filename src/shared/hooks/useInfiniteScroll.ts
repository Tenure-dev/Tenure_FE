import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (onIntersect: () => void, enabled = true) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    });
    observer.observe(target);

    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return targetRef;
};
