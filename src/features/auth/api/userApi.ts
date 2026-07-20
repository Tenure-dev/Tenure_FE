import { api } from '@/shared/lib/api';
import type { UpdateProfileRequest, UserProfile } from './types';

export const getMyInfo = () => api.get<UserProfile>('/users/me');

export const updateMyInfo = (payload: UpdateProfileRequest) =>
  api.patch<UserProfile>('/users/me', payload);
