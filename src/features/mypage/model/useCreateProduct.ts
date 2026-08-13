import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductFromItem } from '../api/itemsApi';
import type { UpdateProductRequest } from '@/features/product/api/dto';

export const useCreateProduct = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => createProductFromItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
