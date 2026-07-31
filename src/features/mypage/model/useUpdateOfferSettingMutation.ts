import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOfferSetting } from '../api/itemsApi';
import type { OfferSettingRequest } from './items';

export const useUpdateOfferSettingMutation = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OfferSettingRequest) => updateOfferSetting(itemId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
