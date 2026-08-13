import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../api/productApi';
import { productDetailQueryKey } from './useProductDetail';
import type { UpdateProductRequest } from '../api/dto';

export const useUpdateProduct = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productDetailQueryKey(productId) });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
