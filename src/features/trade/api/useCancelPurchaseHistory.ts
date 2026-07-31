import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelPurchaseIntent,
  type PurchaseIntentCancelResponse,
} from '@/features/product/api/purchaseIntentApi';
import {
  cancelPurchaseOffer,
  type PurchaseOfferCancelResponse,
} from '@/features/product/api/offerApi';

interface CancelPurchaseHistoryParams {
  historyType: 'PURCHASE_INTENT' | 'PURCHASE_OFFER';
  historyId: number;
}

export const useCancelPurchaseHistory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PurchaseIntentCancelResponse | PurchaseOfferCancelResponse,
    Error,
    CancelPurchaseHistoryParams
  >({
    mutationFn: ({ historyType, historyId }: CancelPurchaseHistoryParams) =>
      historyType === 'PURCHASE_OFFER'
        ? cancelPurchaseOffer(historyId)
        : cancelPurchaseIntent(historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-page-purchases'] });
    },
  });
};
