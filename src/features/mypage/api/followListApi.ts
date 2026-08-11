import { api } from '@/shared/lib/api';

export interface FollowUser {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  following: boolean;
}

export const getMyFollowers = (): Promise<FollowUser[]> => api.get('/users/me/followers');

export const getMyFollowings = (): Promise<FollowUser[]> => api.get('/users/me/followings');

export const getUserFollowers = (userId: number): Promise<FollowUser[]> =>
  api.get(`/users/${userId}/followers`);

export const getUserFollowings = (userId: number): Promise<FollowUser[]> =>
  api.get(`/users/${userId}/followings`);
