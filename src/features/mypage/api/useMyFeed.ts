import { useInfiniteQuery } from '@tanstack/react-query';
import { getHeartedOotds, getMyPosts, getSavedOotds } from './feed';

/** 마이페이지 피드 탭 */
export type FeedTab = '게시물' | '좋아요' | '저장';

export const FEED_TABS: FeedTab[] = ['게시물', '좋아요', '저장'];

type CursorParam = { cursorCreatedAt?: string | null; cursorId?: number | null };

/** 게시물 탭: 내 OOTD 목록 (무한 스크롤) */
export const useMyPosts = (enabled = true) =>
  useInfiniteQuery({
    queryKey: ['ootds', 'me'],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) =>
      getMyPosts({
        cursorCreatedAt: pageParam?.cursorCreatedAt ?? undefined,
        cursorId: pageParam?.cursorId ?? undefined,
      }),
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? { cursorCreatedAt: lastPage.nextCursorCreatedAt, cursorId: lastPage.nextCursorId }
        : undefined,
    enabled,
    staleTime: 60_000,
  });

/** 좋아요·저장 탭: 반응한 OOTD 목록 (무한 스크롤) */
export const useReactedOotds = (tab: '좋아요' | '저장', enabled = true) =>
  useInfiniteQuery({
    queryKey: ['ootds', tab === '좋아요' ? 'hearted' : 'saved'],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) =>
      (tab === '좋아요' ? getHeartedOotds : getSavedOotds)({
        cursorCreatedAt: pageParam?.cursorCreatedAt ?? undefined,
        cursorId: pageParam?.cursorId ?? undefined,
      }),
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? { cursorCreatedAt: lastPage.nextCursorCreatedAt, cursorId: lastPage.nextCursorId }
        : undefined,
    enabled,
    staleTime: 60_000,
  });
