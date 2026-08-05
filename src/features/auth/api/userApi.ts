import { api } from '@/shared/lib/api';
import type {
  AccountSettingsUpdateRequest,
  ProfileImageUploadResponse,
  UpdateProfileRequest,
  UserProfile,
  WithdrawalRequest,
} from './types';

export const getMyInfo = () => api.get<UserProfile>('/users/me');

export const updateMyInfo = (payload: UpdateProfileRequest) =>
  api.patch<UserProfile>('/users/me', payload);

// 보낸 필드만 수정되는 부분 업데이트. defaultShippingFee/settlementAccount 중
// 실제로 바꾸는 필드만 담아 호출해야 다른 쪽 값이 그대로 유지된다.
export const updateAccountSettings = (payload: AccountSettingsUpdateRequest) =>
  api.patch<UserProfile>('/users/me/settings', payload);

// BE: POST /images/profile (multipart/form-data, part name "image") -> 저장된 URL 반환.
// 반환된 imageUrl을 updateMyInfo의 profileImageUrl로 넘겨 프로필에 반영한다.
export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<ProfileImageUploadResponse>('/images/profile', formData);
};

export const withdrawUser = (payload: WithdrawalRequest) =>
  api.delete<void>('/users/me', { data: payload });
