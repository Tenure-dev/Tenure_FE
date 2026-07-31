import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyPurchases } from './myPageTradeApi';
import type { MyPagePurchaseTab } from './types';

export const usePurchaseHistory = (tab: MyPagePurchaseTab) =>
  useInfiniteQuery({
    queryKey: ['my-page-purchases', tab] as const,
    queryFn: ({ pageParam }: { pageParam: number }) => getMyPurchases({ tab, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });
