import { useQuery } from '@tanstack/react-query';
import { getOfferDetail } from '../api/offerApi';

export const useOfferDetail = (offerId: number) =>
  useQuery({
    queryKey: ['offers', offerId],
    queryFn: () => getOfferDetail(offerId),
    enabled: !!offerId,
  });
