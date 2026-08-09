import { api } from '@/shared/lib/api';
import type { MyPostsResponse, ReactedListResponse } from './dto';

const PAGE_SIZE = 20;

export type CursorParams = { cursorCreatedAt?: string; cursorId?: number };

/** 게시물 탭: 내 OOTD 목록 (커서 페이지네이션) */
export const getMyPosts = (cursor?: CursorParams) =>
  api.get<MyPostsResponse>('/ootds/me', { params: { size: PAGE_SIZE, ...cursor } });

/** 좋아요 탭: 하트한 OOTD 목록 (커서 페이지네이션) */
export const getHeartedOotds = (cursor?: CursorParams) =>
  api.get<ReactedListResponse>('/ootds/hearted', { params: { size: PAGE_SIZE, ...cursor } });

/** 저장 탭: 저장한 OOTD 목록 (커서 페이지네이션) */
export const getSavedOotds = (cursor?: CursorParams) =>
  api.get<ReactedListResponse>('/ootds/saved', { params: { size: PAGE_SIZE, ...cursor } });
