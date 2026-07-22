import { api } from '@/shared/lib/api';
import type { AuthResult, LoginRequest, SignupRequest } from './types';

export const signup = (payload: SignupRequest) => api.post<AuthResult>('/auth/signup', payload);

export const login = (payload: LoginRequest) => api.post<AuthResult>('/auth/login', payload);
