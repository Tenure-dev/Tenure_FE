import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserPosts } from '../api/userApi';

type CursorParam = { cursorCreatedAt?: string | null; cursorId?: number | null };

// 유저 프로필 하단 OOTD 피드(공개 게시물) 무한 스크롤 조회.
export const useUserPostsQuery = (userId: number) =>
  useInfiniteQuery({
    queryKey: ['users', userId, 'ootds'],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) =>
      getUserPosts(userId, {
        cursorCreatedAt: pageParam?.cursorCreatedAt ?? undefined,
        cursorId: pageParam?.cursorId ?? undefined,
      }),
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? { cursorCreatedAt: lastPage.nextCursorCreatedAt, cursorId: lastPage.nextCursorId }
        : undefined,
    enabled: userId > 0,
    staleTime: 60 * 1000,
  });
