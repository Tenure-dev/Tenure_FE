import { api } from '@/shared/lib/api';
import type { CreateItemRequest, CreateItemResponse } from '../model/items';

export const createItem = (payload: CreateItemRequest) =>
  api.post<CreateItemResponse>('/items', payload);
