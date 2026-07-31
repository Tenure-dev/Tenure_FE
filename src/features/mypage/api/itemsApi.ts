import { api } from '@/shared/lib/api';

import type { UpdateProductRequest } from '@/features/product/api/dto';
import type {
  CreateProductResponse,
  RegisteredItemListParams,
  RegisteredItemListResponse,
  ItemDetailResponse,
  ItemUpdateRequest,
  ItemUpdateResponse,
  OfferSettingRequest,
  OfferSettingResponse,
  ItemHistoryListResponse,
  CreateItemRequest,
  CreateItemResponse,
  FrequentlyWornItem,
} from '../model/items';

export const getItems = (params?: RegisteredItemListParams) =>
  api.get<RegisteredItemListResponse>('/items', { params });

export const createItem = (payload: CreateItemRequest) =>
  api.post<CreateItemResponse>('/items', payload);

export const getItemDetail = (itemId: number) => 
  api.get<ItemDetailResponse>(`/items/${itemId}`);

export const updateItem = (itemId: number, body: ItemUpdateRequest) =>
  api.patch<ItemUpdateResponse>(`/items/${itemId}`, body);

export const updateOfferSetting = (itemId: number, body: OfferSettingRequest) =>
  api.patch<OfferSettingResponse>(`/items/${itemId}/offer-setting`, body);

export const getItemHistories = (itemId: number, params?: { page?: number; size?: number }) =>
  api.get<ItemHistoryListResponse>(`/items/${itemId}/histories`, { params });

// 아이템 판매 전환
export const createProductFromItem = (itemId: number, body: UpdateProductRequest) =>
  api.post<CreateProductResponse>(`/items/${itemId}/product`, body);

export const getFrequentlyWornTogether = (itemId: number) =>
  api.get<FrequentlyWornItem[]>(`/items/${itemId}/frequently-worn-together`);
