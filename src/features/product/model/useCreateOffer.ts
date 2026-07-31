import { useMutation } from '@tanstack/react-query';
import { createOffer, type CreateOfferRequest } from '../api/offerApi';

export const useCreateOffer = () =>
  useMutation({
    mutationFn: ({ itemId, ...body }: { itemId: number } & CreateOfferRequest) =>
      createOffer(itemId, body),
  });
