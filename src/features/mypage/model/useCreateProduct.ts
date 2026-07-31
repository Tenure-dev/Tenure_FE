import { useMutation } from '@tanstack/react-query';
import { createProductFromItem } from '../api/itemsApi';
import type { UpdateProductRequest } from '@/features/product/api/dto';

export const useCreateProduct = (itemId: number) =>
  useMutation({
    mutationFn: (data: UpdateProductRequest) => createProductFromItem(itemId, data),
  });
