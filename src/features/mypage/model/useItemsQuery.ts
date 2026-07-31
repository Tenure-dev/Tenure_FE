import { useInfiniteQuery } from '@tanstack/react-query';
import { getItems } from '../api/itemsApi';
import type { RegisteredItemListParams } from './items';

export const useItemsQuery = (params?: Omit<RegisteredItemListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['items', params] as const,
    queryFn: ({ pageParam }: { pageParam: number }) => getItems({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });
};
