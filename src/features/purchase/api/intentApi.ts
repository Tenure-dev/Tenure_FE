import { api } from '@/shared/lib/api';
import type { IntentDetailResponse, AcceptTradeResponse } from './dto';

export const getIntentDetail = (intentId: number) =>
  api.get<IntentDetailResponse>(`/purchase-intents/${intentId}`);

export const acceptIntent = (intentId: number) =>
  api.post<AcceptTradeResponse>(`/purchase-intents/${intentId}/accept`);

export const rejectIntent = (intentId: number) =>
  api.post<void>(`/purchase-intents/${intentId}/reject`);

export const cancelIntent = (intentId: number) =>
  api.post<void>(`/purchase-intents/${intentId}/cancel`);
