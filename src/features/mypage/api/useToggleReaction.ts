import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { heartOotd, saveOotd, unheartOotd, unsaveOotd } from './reaction';
import type { MyPostsResponse } from './dto';

type ToggleArgs = { ootdId: number; active: boolean }; // active=true → 등록, false → 취소
type MyPostsInfinite = InfiniteData<MyPostsResponse>;

const MY_POSTS_KEY = ['ootds', 'me'];

// 무한스크롤 캐시(모든 페이지)에서 특정 게시물의 hearted/saved 플래그만 바꾼다.
const patchFlag = (
  data: MyPostsInfinite | undefined,
  ootdId: number,
  field: 'hearted' | 'saved',
  value: boolean,
): MyPostsInfinite | undefined =>
  data
    ? {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          content: page.content.map((p) => (p.ootdId === ootdId ? { ...p, [field]: value } : p)),
        })),
      }
    : data;

// 게시물 탭 하트/저장 토글. 캐시를 낙관적으로 갱신(즉시 반영)하고,
// 성공/실패 후 게시물 목록·반응 탭 캐시를 무효화해 탭 간 상태를 일치시킨다.
export const useToggleHeart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? heartOotd(ootdId) : unheartOotd(ootdId),
    onMutate: async ({ ootdId, active }) => {
      await queryClient.cancelQueries({ queryKey: MY_POSTS_KEY });
      const previous = queryClient.getQueryData<MyPostsInfinite>(MY_POSTS_KEY);
      queryClient.setQueryData<MyPostsInfinite>(MY_POSTS_KEY, (old) =>
        patchFlag(old, ootdId, 'hearted', active),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(MY_POSTS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['ootds', 'hearted'] });
    },
  });
};

export const useToggleSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? saveOotd(ootdId) : unsaveOotd(ootdId),
    onMutate: async ({ ootdId, active }) => {
      await queryClient.cancelQueries({ queryKey: MY_POSTS_KEY });
      const previous = queryClient.getQueryData<MyPostsInfinite>(MY_POSTS_KEY);
      queryClient.setQueryData<MyPostsInfinite>(MY_POSTS_KEY, (old) =>
        patchFlag(old, ootdId, 'saved', active),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(MY_POSTS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['ootds', 'saved'] });
    },
  });
};
