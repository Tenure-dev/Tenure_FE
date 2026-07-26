export type TradeRole = 'buyer' | 'seller';
export type TradeStatus = 'pending' | 'progress' | 'done' | 'cancelled' | 'expired' | 'rejected';
export type ProductType = 'sale' | 'unsold';

export interface TradeListItem {
  tradeId: string;
  role: TradeRole;
  status: TradeStatus;
  brand: string;
  itemName: string;
  price: number;
  date: string;
}

export interface TradeTimelineStep {
  label: string;
  date: string | null;
}

export interface TradeShippingInfo {
  courier: string;
  orderNumber: string;
  receiver: string;
  address: string;
  addressDetail: string;
  phone: string;
  request?: string;
}

export interface TradeCounterpart {
  nickname: string;
  followerCount: number;
}

export interface TradeDetail {
  tradeId: string;
  role: TradeRole;
  status: TradeStatus;
  productType: ProductType;
  orderNumber: string;
  brand: string;
  itemName: string;
  saleStatus: string;
  offerPrice: number;
  shippingFee: number;
  commissionFee: number;
  settlementAmount: number;
  timeline: TradeTimelineStep[];
  currentStepIndex: number;
  courierName: string;
  trackingNumber: string;
  autoConfirmDeadline: string;
  counterpart: TradeCounterpart;
  shippingInfo: TradeShippingInfo;
  buyerRequest?: string;
  paymentAmount: number;
  paymentMethod: string;
  settlementAccount: string;
  deadlineText: string;
}
