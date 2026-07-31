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
      // 수락/거절/취소 결과가 목록 화면(마이페이지 판매·구매내역, 받은 제안)에도 반영되도록 함께 무효화한다.
      queryClient.invalidateQueries({ queryKey: ['my-page-sales'] });
      queryClient.invalidateQueries({ queryKey: ['my-page-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['received-offers'] });
      queryClient.invalidateQueries({ queryKey: ['item-detail'] });
    },
  });
};
