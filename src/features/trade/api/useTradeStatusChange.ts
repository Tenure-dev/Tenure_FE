import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeTradeStatus } from './tradeApi';
import type { TradeStatusChangeRequest } from './types';

export const useTradeStatusChange = (tradeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TradeStatusChangeRequest) => changeTradeStatus(tradeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', tradeId] });
    },
  });
};
