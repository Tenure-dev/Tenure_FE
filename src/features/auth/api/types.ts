export type ApiGender = 'MALE' | 'FEMALE';

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  gender: ApiGender;
  height: number;
  weight: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResult {
  userId: number;
  accessToken: string;
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

export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  gender: ApiGender;
  height: number;
  weight: number;
}

export type UpdateProfileRequest = Pick<UserProfile, 'nickname' | 'gender' | 'height' | 'weight'>;
