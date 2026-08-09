import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { unheartOotd, unsaveOotd } from './reaction';
import type { ReactedListResponse } from './dto';

type ReactedInfinite = InfiniteData<ReactedListResponse>;

/** 좋아요·저장 탭에서 항목 취소 */
export const useRemoveReaction = (tab: '좋아요' | '저장') => {
  const queryClient = useQueryClient();
  const queryKey = tab === '좋아요' ? ['ootds', 'hearted'] : ['ootds', 'saved'];

  return useMutation({
    mutationFn: (ootdId: number) => (tab === '좋아요' ? unheartOotd(ootdId) : unsaveOotd(ootdId)),

    // 낙관적 업데이트: 누르는 즉시 목록에서 제거 (재조회를 기다리지 않고 바로 반영)
    onMutate: async (ootdId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ReactedInfinite>(queryKey);
      queryClient.setQueryData<ReactedInfinite>(queryKey, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                content: page.content.filter((it) => it.ootdId !== ootdId),
              })),
            }
          : old,
      );
      return { previous };
    },

    // 실패 시 되돌리기
    onError: (_err, _ootdId, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },

    // 성공/실패 무관하게 서버 기준으로 최종 동기화.
    // 게시물 탭(hearted/saved 플래그)도 무효화해 탭 간 상태를 일치시킨다.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['ootds', 'me'] });
    },
  });
};
