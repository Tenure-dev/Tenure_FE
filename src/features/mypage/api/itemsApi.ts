import { api } from '@/shared/lib/api';
import type {
  RegisteredItemListParams,
  RegisteredItemListResponse,
  RegisteredItemDetailResponse,
  ItemUpdateRequest,
  ItemUpdateResponse,
} from '../model/items';

export const getItems = (params?: RegisteredItemListParams) =>
  api.get<RegisteredItemListResponse>('/items', { params });

export const getItemDetail = (itemId: number) =>
  api.get<RegisteredItemDetailResponse>(`/items/${itemId}`);

export const updateItem = (itemId: number, body: ItemUpdateRequest) =>
  api.patch<ItemUpdateResponse>(`/items/${itemId}`, body);
