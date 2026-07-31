import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptOffer, rejectOffer, cancelOffer } from '../api/offerApi';
import type { AcceptTradeResponse } from '../api/dto';

type OfferAction = 'ACCEPT' | 'REJECT' | 'CANCEL';

export const useOfferAction = (offerId: number) => {
  const queryClient = useQueryClient();
  return useMutation<AcceptTradeResponse | void, Error, OfferAction>({
    mutationFn: async (action: OfferAction): Promise<AcceptTradeResponse | void> => {
      if (action === 'ACCEPT') return acceptOffer(offerId);
      if (action === 'REJECT') return rejectOffer(offerId);
      return cancelOffer(offerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers', offerId] });
    },
  });
};
