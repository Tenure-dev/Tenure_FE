import { api } from '@/shared/lib/api';
import type {
  DeliveryCarrier,
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

// TradeTransition.REGISTER_SHIPMENT(PAID -> SHIPPED) 전이. 별도 엔드포인트가 아니라
// 동일한 상태 변경 엔드포인트를 status: 'SHIPPED'로 호출한다.
export const registerShipment = (
  tradeId: number,
  payload: {
    deliveryCarrier: DeliveryCarrier;
    trackingNumber: string;
    customDeliveryCarrierName?: string;
  },
) => changeTradeStatus(tradeId, { status: 'SHIPPED', ...payload });
