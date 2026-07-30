import { useQuery } from '@tanstack/react-query';
import { getMyPurchases } from './myPageTradeApi';
import type { MyPagePurchaseTab } from './types';

export const usePurchaseHistory = (tab: MyPagePurchaseTab, page: number) =>
  useQuery({
    queryKey: ['my-page-purchases', tab, page],
    queryFn: () => getMyPurchases({ tab, page }),
  });
