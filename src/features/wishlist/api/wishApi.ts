import { api } from '@/shared/lib/api';
import type {
  ApiProductStatus,
  WishCreateResponseDto,
  WishDeleteResponseDto,
  WishListPageResponse,
} from './dto';

export interface GetWishesParams {
  query?: string;
  saleStatus?: ApiProductStatus;
  page?: number;
  size?: number;
}

export const getWishes = ({ query, saleStatus, page = 0, size = 8 }: GetWishesParams = {}) =>
  api.get<WishListPageResponse>('/wishes', { params: { query, saleStatus, page, size } });

export const createWish = (itemId: number | string) =>
  api.post<WishCreateResponseDto>(`/items/${itemId}/wish`);

export const deleteWish = (itemId: number | string) =>
  api.delete<WishDeleteResponseDto>(`/items/${itemId}/wish`);
