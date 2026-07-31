import { useQuery } from '@tanstack/react-query';
import { getIntentDetail } from '../api/intentApi';

export const useIntentDetail = (intentId: number) =>
  useQuery({
    queryKey: ['purchase-intents', intentId],
    queryFn: () => getIntentDetail(intentId),
    enabled: !!intentId,
  });
