import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { heartOotd, saveOotd, unheartOotd, unsaveOotd } from '@/features/ootd/api/ootdApi';
import type { MyPostItem, MyPostsResponse } from '@/features/mypage/api/dto';

type ToggleArgs = { ootdId: number; active: boolean }; // active=true 등록, false 취소
type FeedInfinite = InfiniteData<MyPostsResponse>;

const USER_POSTS_KEY = (userId: number) => ['users', userId, 'ootds'] as const;

// 무한스크롤 캐시(모든 페이지)에서 특정 게시물만 낙관적으로 갱신한다.
const patchItem = (
  data: FeedInfinite | undefined,
  ootdId: number,
  update: (item: MyPostItem) => MyPostItem,
): FeedInfinite | undefined =>
  data
    ? {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          content: page.content.map((p) => (p.ootdId === ootdId ? update(p) : p)),
        })),
      }
    : data;

// 유저 프로필 피드의 하트 토글 (해당 유저 피드 캐시를 낙관적으로 갱신).
export const useToggleUserFeedHeart = (userId: number) => {
  const queryClient = useQueryClient();
  const key = USER_POSTS_KEY(userId);
  return useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? heartOotd(ootdId) : unheartOotd(ootdId),
    onMutate: async ({ ootdId, active }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FeedInfinite>(key);
      queryClient.setQueryData<FeedInfinite>(key, (old) =>
        patchItem(old, ootdId, (item) => ({
          ...item,
          hearted: active,
          heartCount: Math.max(0, item.heartCount + (active ? 1 : -1)),
        })),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
    },
  });
};

// 유저 프로필 피드의 저장 토글.
export const useToggleUserFeedSave = (userId: number) => {
  const queryClient = useQueryClient();
  const key = USER_POSTS_KEY(userId);
  return useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? saveOotd(ootdId) : unsaveOotd(ootdId),
    onMutate: async ({ ootdId, active }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FeedInfinite>(key);
      queryClient.setQueryData<FeedInfinite>(key, (old) =>
        patchItem(old, ootdId, (item) => ({
          ...item,
          saved: active,
          saveCount: Math.max(0, item.saveCount + (active ? 1 : -1)),
        })),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
    },
  });
};
