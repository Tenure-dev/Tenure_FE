import { api } from '@/shared/lib/api';
import type { MyPostsResponse } from '@/features/mypage/api/dto';

export type UserProfileResponse = {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  gender: string;
  heightCm: number | null;
  weightKg: number | null;
  grade: string;
};

export type UserFeedProfileResponse = {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  gender: string;
  heightCm: number | null;
  weightKg: number | null;
  grade: string;
  feedCount: number;
  itemCount: number;
  followerCount: number;
  isFollowing: boolean;
};

export const getUserProfile = (userId: number) => api.get<UserProfileResponse>(`/users/${userId}`);

export const getUserFeedProfile = (userId: number) =>
  api.get<UserFeedProfileResponse>(`/users/${userId}`);

// 팔로우/언팔로우 — 결과로 팔로우 여부와 대상의 팔로워 수를 돌려준다.
export interface FollowResponse {
  targetUserId: number;
  following: boolean;
  followerCount: number;
}

export const followUser = (userId: number): Promise<FollowResponse> =>
  api.post(`/users/${userId}/follow`);

export const unfollowUser = (userId: number): Promise<FollowResponse> =>
  api.delete(`/users/${userId}/follow`);

// 타 사용자 공개 OOTD 피드 (커서 기반, 첫 페이지 20개). 응답 형태는 /ootds/me와 동일.
export const getUserPosts = (userId: number) =>
  api.get<MyPostsResponse>(`/users/${userId}/ootds`, { params: { size: 20 } });
