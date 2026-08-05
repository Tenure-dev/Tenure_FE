import { api } from '@/shared/lib/api';
import type {
  ApiItemStatus,
  FollowResponse,
  ItemListPage,
  OotdDetailResponse,
  OotdRelatedResponse,
  OotdTagBatchRequest,
  OotdTagBatchResponse,
  OotdTagConfirmResponse,
  OotdTagCreateRequest,
  OotdTagResponse,
  OotdTagUpdateRequest,
} from './types';

export const getOotdDetail = (ootdId: number): Promise<OotdDetailResponse> =>
  api.get(`/ootds/${ootdId}`);

export const deleteOotd = (ootdId: number): Promise<void> => api.delete(`/ootds/${ootdId}`);

export const heartOotd = (ootdId: number): Promise<void> => api.post(`/ootds/${ootdId}/heart`);
export const unheartOotd = (ootdId: number): Promise<void> => api.delete(`/ootds/${ootdId}/heart`);
export const saveOotd = (ootdId: number): Promise<void> => api.post(`/ootds/${ootdId}/save`);
export const unsaveOotd = (ootdId: number): Promise<void> => api.delete(`/ootds/${ootdId}/save`);

export const followUser = (userId: number): Promise<FollowResponse> =>
  api.post(`/users/${userId}/follow`);
export const unfollowUser = (userId: number): Promise<FollowResponse> =>
  api.delete(`/users/${userId}/follow`);

export const getRelatedOotds = (ootdId: number): Promise<OotdRelatedResponse> =>
  api.get(`/ootds/${ootdId}/related`);

export const createTag = (
  ootdId: number,
  request: OotdTagCreateRequest,
): Promise<OotdTagResponse> => api.post(`/ootds/${ootdId}/tags`, request);

export const updateTag = (tagId: number, request: OotdTagUpdateRequest): Promise<OotdTagResponse> =>
  api.patch(`/ootds/tags/${tagId}`, request);

export const confirmTags = (ootdId: number): Promise<OotdTagConfirmResponse> =>
  api.post(`/ootds/${ootdId}/tags/confirm`);

// 태그 일괄 교체: 기존 태그를 모두 삭제하고 요청 목록으로 대체(모두 CONFIRMED).
// 추가·수정·삭제를 한 번에 처리한다. 목록은 최소 1개 이상이어야 한다(빈 목록은 400).
export const createTagsBatch = (
  ootdId: number,
  request: OotdTagBatchRequest,
): Promise<OotdTagBatchResponse> => api.post(`/ootds/${ootdId}/tags/batch`, request);

export interface GetMyItemsParams {
  query?: string;
  itemStatus?: ApiItemStatus;
  page?: number;
  size?: number;
}

export const getMyItems = (params: GetMyItemsParams = {}): Promise<ItemListPage> =>
  api.get('/items', { params });

export const wishItem = (itemId: number): Promise<void> => api.post(`/items/${itemId}/wish`);
export const unwishItem = (itemId: number): Promise<void> => api.delete(`/items/${itemId}/wish`);
