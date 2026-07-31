import { useMutation } from '@tanstack/react-query';
import { createPurchaseIntent, type CreatePurchaseIntentRequest } from '../api/purchaseIntentApi';

export const useCreatePurchaseIntent = () =>
  useMutation({
    mutationFn: ({ productId, ...body }: { productId: number } & CreatePurchaseIntentRequest) =>
      createPurchaseIntent(productId, body),
  });
