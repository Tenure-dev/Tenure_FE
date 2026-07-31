import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptIntent, rejectIntent, cancelIntent } from '../api/intentApi';
import type { AcceptTradeResponse } from '../api/dto';

type IntentAction = 'ACCEPT' | 'REJECT' | 'CANCEL';

export const useIntentAction = (intentId: number) => {
  const queryClient = useQueryClient();
  return useMutation<AcceptTradeResponse | void, Error, IntentAction>({
    mutationFn: async (action: IntentAction): Promise<AcceptTradeResponse | void> => {
      if (action === 'ACCEPT') return acceptIntent(intentId);
      if (action === 'REJECT') return rejectIntent(intentId);
      return cancelIntent(intentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-intents', intentId] });
      // 수락/거절/취소 결과가 목록 화면(마이페이지 판매·구매내역, 받은 요청)에도 반영되도록 함께 무효화한다.
      queryClient.invalidateQueries({ queryKey: ['my-page-sales'] });
      queryClient.invalidateQueries({ queryKey: ['my-page-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['received-intents'] });
      queryClient.invalidateQueries({ queryKey: ['item-detail'] });
    },
  });
};
