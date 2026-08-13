import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '../api/itemsApi';

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
