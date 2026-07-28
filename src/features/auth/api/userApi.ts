import { api } from '@/shared/lib/api';
import type { ProfileImageUploadResponse, UpdateProfileRequest, UserProfile } from './types';

export const getMyInfo = () => api.get<UserProfile>('/users/me');

export const updateMyInfo = (payload: UpdateProfileRequest) =>
  api.patch<UserProfile>('/users/me', payload);

// BE: POST /images/profile (multipart/form-data, part name "image") -> 저장된 URL 반환.
// 반환된 imageUrl을 updateMyInfo의 profileImageUrl로 넘겨 프로필에 반영한다.
export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<ProfileImageUploadResponse>('/images/profile', formData);
};
