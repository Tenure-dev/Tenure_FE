import { api } from '@/shared/lib/api';

import type {
  RegisteredItemListParams,
  RegisteredItemListResponse,
  RegisteredItemDetailResponse,
  ItemUpdateRequest,
  ItemUpdateResponse,
  OfferSettingRequest,
  OfferSettingResponse,
  ItemHistoryListResponse,
  CreateItemRequest,
  CreateItemResponse,
} from '../model/items';

export const getItems = (params?: RegisteredItemListParams) =>
  api.get<RegisteredItemListResponse>('/items', { params });

export const createItem = (payload: CreateItemRequest) =>
  api.post<CreateItemResponse>('/items', payload);

export const getItemDetail = (itemId: number) =>
  api.get<RegisteredItemDetailResponse>(`/items/${itemId}`);

export const updateItem = (itemId: number, body: ItemUpdateRequest) =>
  api.patch<ItemUpdateResponse>(`/items/${itemId}`, body);

export const updateOfferSetting = (itemId: number, body: OfferSettingRequest) =>
  api.patch<OfferSettingResponse>(`/items/${itemId}/offer-setting`, body);

export const getItemHistories = (itemId: number, params?: { page?: number; size?: number }) =>
  api.get<ItemHistoryListResponse>(`/items/${itemId}/histories`, { params });
