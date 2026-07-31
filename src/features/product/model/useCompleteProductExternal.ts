import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeProductExternal } from '../api/productApi';
import { productDetailQueryKey } from './useProductDetail';
import type { ProductDetailResponse } from '../api/dto';

export const useCompleteProductExternal = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeProductExternal(productId),
    onSuccess: () => {
      queryClient.setQueryData<ProductDetailResponse>(productDetailQueryKey(productId), (prev) =>
        prev ? { ...prev, productStatus: 'SOLD' } : prev,
      );
    },
  });
};
