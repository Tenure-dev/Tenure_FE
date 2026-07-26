import { api } from '@/shared/lib/api';
import type { MyPostsResponse, ReactedListResponse } from './dto';

// 1단계는 첫 페이지(size 20)만 불러온다. 무한스크롤(cursor)은 다음 작업으로 분리.
const PAGE_SIZE = 20;

/** 게시물 탭: 내 OOTD 목록 */
export const getMyPosts = () =>
  api.get<MyPostsResponse>('/ootds/me', { params: { size: PAGE_SIZE } });

/** 좋아요 탭: 하트한 OOTD 목록 */
export const getHeartedOotds = () =>
  api.get<ReactedListResponse>('/ootds/hearted', { params: { size: PAGE_SIZE } });

/** 저장 탭: 저장한 OOTD 목록 */
export const getSavedOotds = () =>
  api.get<ReactedListResponse>('/ootds/saved', { params: { size: PAGE_SIZE } });
