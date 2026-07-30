export type ApiGender = 'MALE' | 'FEMALE';

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  termsOfServiceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  thirdPartyAgreed: boolean;
  addressLine1: string;
  addressLine2: string;
  postalCode?: string;
  username: string;
  gender: ApiGender;
  heightCm: number;
  weightKg: number;
  profileImageUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmailSendRequest {
  email: string;
}

export interface EmailVerifyRequest {
  email: string;
  code: string;
}

export interface AuthResult {
  userId: number;
  accessToken: string;
}

export interface UsernameCheckResponse {
  available: boolean;
}

export interface AddressRequest {
  receiverName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  requestNote: string;
  isDefault: boolean;
}

export type ApiUserGrade = 'BASIC' | 'RECORD';
export type ApiAccountVisibility = 'PUBLIC' | 'PRIVATE';

export interface UserProfile {
  userId: number;
  email: string;
  username: string;
  profileImageUrl: string | null;
  gender: ApiGender;
  heightCm: number;
  weightKg: number;
  grade: ApiUserGrade;
  accountVisibility: ApiAccountVisibility;
}

// BE: PATCH /users/me는 보낸 필드만 수정하는 부분 업데이트라 전부 optional이다.
export type UpdateProfileRequest = Partial<
  Pick<UserProfile, 'username' | 'gender' | 'heightCm' | 'weightKg' | 'profileImageUrl'>
>;

export interface ProfileImageUploadResponse {
  imageUrl: string;
}

export type WithdrawalReason =
  'LOW_USAGE' | 'HARD_TO_FIND_ITEMS' | 'USING_OTHER_SERVICE' | 'UNSATISFIED_TRADE';

export interface WithdrawalRequest {
  reason: WithdrawalReason;
}
