export type TradeStatus =
  'PAID' | 'SHIPPED' | 'DELIVERED' | 'PURCHASE_CONFIRMED' | 'SETTLED' | 'COMPLETED' | 'TRANSFERRED';

export type TradeViewerMode = 'BUYER' | 'SELLER';

export interface TradeDetailResponse {
  tradeId: number;
  viewerMode: TradeViewerMode;
  availableActions: string[];
  sourceType: string;
  sourceId: number;
  itemId: number;
  productId: number;
  buyerUserId: number;
  sellerUserId: number;
  status: TradeStatus;
  deliveryCarrier: string | null;
  customDeliveryCarrierName: string | null;
  trackingNumber: string | null;
  itemPrice: number;
  shippingFee: number;
  buyerServiceFee: number;
  sellerServiceFee: number | null;
  paymentAmount: number;
  settlementAmount: number | null;
  tradeRequestNote: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  confirmedAt: string | null;
  settledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TradeStatusChangeRequest {
  status: TradeStatus;
  deliveryCarrier?: string;
  trackingNumber?: string;
  customDeliveryCarrierName?: string;
}

export interface TradeListItemResponse {
  tradeId: number;
  sourceType: string;
  itemId: number;
  productId: number;
  buyerUserId: number;
  sellerUserId: number;
  paymentAmount: number;
  status: TradeStatus;
  createdAt: string;
  item: {
    itemId: number;
    itemName: string;
    brandName: string;
    representativeImageUrl: string;
  };
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type MyPagePurchaseTab = 'ALL' | 'OFFERING' | 'TRADING' | 'COMPLETED';

export type MyPageSalesTab = 'ALL' | 'OFFER_RECEIVED' | 'TRADING' | 'COMPLETED';

// historyType에 따라 historyId/status가 PurchaseIntent, PurchaseOffer, Trade 중
// 하나의 상태값을 담는다 (MyPagePurchaseResponse.java의 fromPurchaseIntent/
// fromPurchaseOffer/fromTrade 참고). productId는 PURCHASE_OFFER 유래거나
// Trade에 연결된 Product가 없으면 null.
export interface MyPagePurchaseResponse {
  historyId: number;
  historyType: 'PURCHASE_INTENT' | 'PURCHASE_OFFER' | 'TRADE';
  itemId: number;
  productId: number | null;
  imageUrl: string;
  brandName: string;
  itemName: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface MyPageSaleResponse {
  historyId: number;
  historyType: 'PURCHASE_INTENT' | 'PURCHASE_OFFER' | 'TRADE';
  itemId: number;
  productId: number | null;
  imageUrl: string;
  brandName: string;
  itemName: string;
  price: number;
  status: string;
  createdAt: string;
}
