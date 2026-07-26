import { api } from '@/shared/lib/api';
import type { AddressRequest } from './types';

export const createAddress = (payload: AddressRequest) => api.post<void>('/addresses', payload);
