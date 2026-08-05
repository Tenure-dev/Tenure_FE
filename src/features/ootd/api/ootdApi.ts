import { api } from '@/shared/lib/api';
import type {
  ApiItemStatus,
  FollowResponse,
  ItemListPage,
  OotdDetailResponse,
  OotdRelatedResponse,
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

export const blockUser = (userId: number): Promise<void> => api.post(`/users/${userId}/block`);
export const unblockUser = (userId: number): Promise<void> => api.delete(`/users/${userId}/block`);

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
