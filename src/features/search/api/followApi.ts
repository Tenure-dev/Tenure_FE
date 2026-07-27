import { api } from '@/shared/lib/api';

export interface FollowResponse {
  targetUserId: number;
  following: boolean;
  followerCount: number;
}

export const followUser = (userId: number): Promise<FollowResponse> =>
  api.post(`/users/${userId}/follow`);

export const unfollowUser = (userId: number): Promise<FollowResponse> =>
  api.delete(`/users/${userId}/follow`);
