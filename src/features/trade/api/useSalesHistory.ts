import { useQuery } from '@tanstack/react-query';
import { getMySales } from './myPageTradeApi';
import type { MyPageSalesTab } from './types';

export const useSalesHistory = (tab: MyPageSalesTab, page: number) =>
  useQuery({
    queryKey: ['my-page-sales', tab, page],
    queryFn: () => getMySales({ tab, page }),
  });
