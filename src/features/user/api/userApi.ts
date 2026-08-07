import { api } from '@/shared/lib/api';

export type UserProfileResponse = {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  gender: string;
  heightCm: number | null;
  weightKg: number | null;
  grade: string;
};

export const getUserProfile = (userId: number) => api.get<UserProfileResponse>(`/users/${userId}`);
