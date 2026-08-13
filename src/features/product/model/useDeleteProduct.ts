import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../api/productApi';
import { productDetailQueryKey } from './useProductDetail';
import type { ProductDetailResponse } from '../api/dto';

export const useDeleteProduct = (productId: number) => {
  const queryClient = useQueryClient();

  // productStatus 바로 HIDDEN으로 변경(페칭안하고 UI만 변경)
  return useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.setQueryData<ProductDetailResponse>(productDetailQueryKey(productId), (prev) =>
        prev ? { ...prev, productStatus: 'HIDDEN' } : prev,
      );
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
