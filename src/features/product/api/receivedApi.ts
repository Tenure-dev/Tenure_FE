import { api } from '@/shared/lib/api';

// 받은 구매 제안 (미판매 아이템 대상, 제안자마다 가격 제시)
export interface ReceivedOfferItem {
  offerId: number;
  status: string;
  itemId: number;
  brandName: string;
  itemName: string;
  imageUrl: string | null;
  proposerId: number;
  proposerUsername: string;
  proposerProfileImageUrl: string | null;
  offerAmount: number;
  remainingSeconds: number;
}

// 받은 거래 의사 (판매중 상품 대상, 가격은 판매자가 고정)
export interface ReceivedIntentItem {
  intentId: number;
  status: string;
  productId: number;
  itemId: number;
  brandName: string;
  itemName: string;
  imageUrl: string | null;
  buyerId: number;
  buyerUsername: string;
  buyerProfileImageUrl: string | null;
  productAmount: number;
  remainingSeconds: number;
}

interface ReceivedListResponse<T> {
  content: T[];
  nextCursor: unknown;
  hasNext: boolean;
}

// 전체 flat 리스트라, 화면에선 itemId로 필터해서 씀.
// 백엔드 최대 size가 50이라 그 이상은 400 → 50으로 받음.
export const getReceivedOffers = (size = 50) =>
  api.get<ReceivedListResponse<ReceivedOfferItem>>('/purchase-offers/received', {
    params: { size },
  });

export const getReceivedIntents = (size = 50) =>
  api.get<ReceivedListResponse<ReceivedIntentItem>>('/purchase-intents/received', {
    params: { size },
  });
