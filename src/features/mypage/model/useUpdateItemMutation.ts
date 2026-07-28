import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateItem } from '../api/itemsApi';
import type { ItemUpdateRequest } from './items';

export const useUpdateItemMutation = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ItemUpdateRequest) => updateItem(itemId, body),
    // prefix 매칭으로 상세(['items', itemId])와 목록(['items', params])을 함께 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
