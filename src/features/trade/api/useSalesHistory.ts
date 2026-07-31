import { useInfiniteQuery } from '@tanstack/react-query';
import { getMySales } from './myPageTradeApi';
import type { MyPageSalesTab } from './types';

export const useSalesHistory = (tab: MyPageSalesTab) =>
  useInfiniteQuery({
    queryKey: ['my-page-sales', tab] as const,
    queryFn: ({ pageParam }: { pageParam: number }) => getMySales({ tab, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });
