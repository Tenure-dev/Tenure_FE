import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { updateWishNotification } from '../api/wishApi';
import type { WishListPageResponse } from '../api/dto';

type Variables = { itemId: number; notificationEnabled: boolean };

const WISHES_KEY = ['wishes'];

const patchNotification = (
  data: InfiniteData<WishListPageResponse> | undefined,
  itemId: number,
  notificationEnabled: boolean,
): InfiniteData<WishListPageResponse> | undefined =>
  data
    ? {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          content: page.content.map((wish) =>
            wish.itemId === itemId ? { ...wish, notificationEnabled } : wish,
          ),
        })),
      }
    : data;

// 위시리스트는 탭('전체'/'판매중'/'거래중')별로 캐시가 분리돼 있어(queryKey: ['wishes', tab]),
// 같은 itemId가 여러 탭 캐시에 동시에 들어있을 수 있다. 그래서 단일 setQueryData 대신
// ['wishes']로 시작하는 모든 캐시를 찾아 함께 갱신한다.
export const useUpdateWishNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, notificationEnabled }: Variables) =>
      updateWishNotification(itemId, notificationEnabled),
    onMutate: async ({ itemId, notificationEnabled }) => {
      await queryClient.cancelQueries({ queryKey: WISHES_KEY });
      const previous = queryClient.getQueriesData<InfiniteData<WishListPageResponse>>({
        queryKey: WISHES_KEY,
      });
      queryClient.setQueriesData<InfiniteData<WishListPageResponse>>(
        { queryKey: WISHES_KEY },
        (old) => patchNotification(old, itemId, notificationEnabled),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHES_KEY });
    },
  });
};
