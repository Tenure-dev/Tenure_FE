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
    },
  });
};
