import { api } from '@/shared/lib/api';
import type { OfferDetailResponse, AcceptTradeResponse } from './dto';

export const getOfferDetail = (offerId: number) =>
  api.get<OfferDetailResponse>(`/offers/${offerId}`);

export const acceptOffer = (offerId: number) =>
  api.post<AcceptTradeResponse>(`/purchase-offers/${offerId}/accept`);

export const rejectOffer = (offerId: number) =>
  api.post<void>(`/purchase-offers/${offerId}/reject`);

export const cancelOffer = (offerId: number) =>
  api.post<void>(`/purchase-offers/${offerId}/cancel`);
