import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem } from '../api/itemsApi';
import type { CreateItemRequest } from './items';

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemRequest) => createItem(payload),
    onSuccess: () => {
      // 쿼리키 수정 필요함!!
      queryClient.invalidateQueries({ queryKey: ['items', 'registered'] });
    },
  });
};
