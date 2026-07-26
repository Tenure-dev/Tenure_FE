import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '../api/feedApi';
import type { FeedParams } from './types';

type CursorParam = {
  cursorCreatedAt?: string | null;
  cursorId?: number | null;
};

export const useFeedQuery = (params?: Omit<FeedParams, 'cursorCreatedAt' | 'cursorId'>) => {
  return useInfiniteQuery({
    queryKey: ['feed', params] as const,
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) =>
      getFeed({
        ...params,
        cursorCreatedAt: pageParam?.cursorCreatedAt ?? undefined,
        cursorId: pageParam?.cursorId ?? undefined,
      }),
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? { cursorCreatedAt: lastPage.nextCursorCreatedAt, cursorId: lastPage.nextCursorId }
        : undefined,
  });
};
