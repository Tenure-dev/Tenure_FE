import { useQuery } from '@tanstack/react-query';
import { getProductDetail } from '../api/productApi';
import type { ProductDetailResponse } from '../api/dto';

export const productDetailQueryKey = (productId: number) => ['product', productId] as const;

export const useProductDetail = (productId: number) =>
  useQuery<ProductDetailResponse>({
    queryKey: productDetailQueryKey(productId),
    queryFn: () => getProductDetail(productId),
    enabled: !isNaN(productId),
    staleTime: 5 * 60 * 1000,
  });
