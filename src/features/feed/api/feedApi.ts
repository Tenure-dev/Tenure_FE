import { api } from '@/shared/lib/api';
import type { FeedResponse, FeedParams, FollowedUser } from '../model/types';

export const getFeed = (params?: FeedParams) => api.get<FeedResponse>('/feed', { params });

export const getFollowings = (userId: number) =>
  api.get<FollowedUser[]>(`/users/${userId}/followings`);
