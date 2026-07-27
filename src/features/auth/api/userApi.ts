import { api } from '@/shared/lib/api';
import type { UpdateProfileRequest, UserProfile, WithdrawalRequest } from './types';

export const getMyInfo = () => api.get<UserProfile>('/users/me');

export const updateMyInfo = (payload: UpdateProfileRequest) =>
  api.patch<UserProfile>('/users/me', payload);

export const withdrawUser = (payload: WithdrawalRequest) =>
  api.delete<void>('/users/me', { data: payload });
