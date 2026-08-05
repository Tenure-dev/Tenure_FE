import { api } from '@/shared/lib/api';
import type {
  CompleteExternalResponse,
  DeleteProductResponse,
  ProductDetailResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from './dto';

export const getProductDetail = (productId: number) =>
  api.get<ProductDetailResponse>(`/products/${productId}`);

// 미판매로 변경
export const deleteProduct = (productId: number) =>
  api.delete<DeleteProductResponse>(`/products/${productId}`);

// 판매 완료
export const completeProductExternal = (productId: number) =>
  api.post<CompleteExternalResponse>(`/products/${productId}/complete-external`);

// 상품 정보 수정
export const updateProduct = (productId: number, data: UpdateProductRequest) =>
  api.patch<UpdateProductResponse>(`/products/${productId}`, data);
