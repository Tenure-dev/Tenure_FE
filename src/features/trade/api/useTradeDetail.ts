import { useQuery } from '@tanstack/react-query';
import { getTradeDetail } from './tradeApi';

export const useTradeDetail = (tradeId: number) =>
  useQuery({
    queryKey: ['trades', tradeId],
    queryFn: () => getTradeDetail(tradeId),
    enabled: !!tradeId,
  });
