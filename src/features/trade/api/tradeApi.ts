import { api } from '@/shared/lib/api';
import type {
  PageResponse,
  TradeDetailResponse,
  TradeListItemResponse,
  TradeStatus,
  TradeStatusChangeRequest,
} from './types';

export const getTradeList = (params?: {
  role?: 'BUYER' | 'SELLER';
  status?: TradeStatus[];
  page?: number;
  size?: number;
}) => api.get<PageResponse<TradeListItemResponse>>('/trades', { params });

export const getTradeDetail = (tradeId: number) =>
  api.get<TradeDetailResponse>(`/trades/${tradeId}`);

export const changeTradeStatus = (tradeId: number, payload: TradeStatusChangeRequest) =>
  api.post<TradeDetailResponse>(`/trades/${tradeId}/status`, payload);
