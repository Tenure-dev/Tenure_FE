import { api } from '@/shared/lib/api';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

export type UserProfile = {
  userId: number;
  username: string;
  profileImageUrl: string;
  gender: 'MALE' | 'FEMALE';
  heightCm: number;
  weightKg: number;
  grade: string;
};

export const getUserProfile = (userId: number) =>
  api
    .get<UserProfile>(`/users/${userId}`)
    .then((profile) => ({ ...profile, profileImageUrl: resolveImageUrl(profile.profileImageUrl) }));
