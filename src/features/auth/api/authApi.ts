import { api } from '@/shared/lib/api';
import type {
  AuthResult,
  EmailSendRequest,
  EmailVerifyRequest,
  LoginRequest,
  PasswordResetRequest,
  PasswordResetSendRequest,
  SignupRequest,
  UsernameCheckResponse,
} from './types';

export const signup = (payload: SignupRequest) => api.post<AuthResult>('/auth/signup', payload);

export const login = (payload: LoginRequest) => api.post<AuthResult>('/auth/login', payload);

export const sendEmailVerification = (payload: EmailSendRequest) =>
  api.post<void>('/auth/email/send', payload);

export const verifyEmailCode = (payload: EmailVerifyRequest) =>
  api.post<void>('/auth/email/verify', payload);

export const checkUsernameAvailable = (username: string) =>
  api.get<UsernameCheckResponse>('/auth/username/check', { params: { username } });

export const sendPasswordResetCode = (payload: PasswordResetSendRequest) =>
  api.post<void>('/auth/password/reset/send', payload);

export const resetPassword = (payload: PasswordResetRequest) =>
  api.post<void>('/auth/password/reset', payload);
