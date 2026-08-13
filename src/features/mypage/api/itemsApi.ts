import { api } from '@/shared/lib/api';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

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
  HistoryOotdsResponse,
  CreateItemRequest,
  CreateItemResponse,
  FrequentlyWornItem,
} from '../model/items';

export const getItems = (params?: RegisteredItemListParams) =>
  api.get<RegisteredItemListResponse>('/items', { params });

export const createItem = (payload: CreateItemRequest) =>
  api.post<CreateItemResponse>('/items', payload);

export const getItemDetail = (itemId: number) => api.get<ItemDetailResponse>(`/items/${itemId}`);

export const updateItem = (itemId: number, body: ItemUpdateRequest) =>
  api.patch<ItemUpdateResponse>(`/items/${itemId}`, body);

export const updateOfferSetting = (itemId: number, body: OfferSettingRequest) =>
  api.patch<OfferSettingResponse>(`/items/${itemId}/offer-setting`, body);

// 아이템 판매 전환
export const createProductFromItem = (itemId: number, body: UpdateProductRequest) =>
  api.post<CreateProductResponse>(`/items/${itemId}/product`, body);

// 아이템 대표 사진
export const uploadItemImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<{ imageUrl: string }>('/images/items', formData);
};

export const getFrequentlyWornTogether = (itemId: number) =>
  api.get<FrequentlyWornItem[]>(`/items/${itemId}/frequently-worn-together`);

// 아이템 히스토리 카드들 정보
export const getItemHistories = (itemId: number, params?: { page?: number; size?: number }) =>
  api.get<ItemHistoryListResponse>(`/items/${itemId}/histories`, { params });

// 아이템 히스토리 카드 내 OOTD 정보
export const getHistoryOotds = (
  itemId: number,
  historyId: number,
  params?: { page?: number; size?: number },
) =>
  api
    .get<HistoryOotdsResponse>(`/items/${itemId}/histories/${historyId}/ootds`, { params })
    .then((res) => ({
      ...res,
      content: res.content.map((ootd) => ({ ...ootd, imageUrl: resolveImageUrl(ootd.imageUrl) })),
    }));

export const deleteItem = (itemId: number) =>
  api.delete<{ itemId: number; itemStatus: string }>(`/items/${itemId}`);

// 판매 전환 대표 OOTD 후보 조회 (해당 아이템이 태그된 OOTD)
export const getItemOotdCandidates = (itemId: number, params?: { page?: number; size?: number }) =>
  api.get<HistoryOotdsResponse>(`/items/${itemId}/ootds`, { params });
