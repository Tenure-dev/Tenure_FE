import type {
  ProposalStatus,
  DeliveryDisclosureStatus,
  OfferViewerRole,
  IntentViewerRole,
} from '../model/types';

interface TradeUser {
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

interface ProposalAmounts {
  productAmount: number;
  shippingFee: number;
  buyerServiceFee: number;
  sellerServiceFee: number;
  buyerPaymentAmount: number;
  sellerSettlementAmount: number;
}

interface ProposalDelivery {
  receiverName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  requestNote: string | null;
}

export interface AcceptTradeResponse {
  tradeId: number;
}

export interface OfferDetailResponse {
  offerId: number;
  status: ProposalStatus;
  viewerRole: OfferViewerRole;
  serverTime: string;
  expiresAt: string;
  remainingSeconds: number;
  paymentAuthorizationStatus: string;
  item: {
    itemId: number;
    brandName: string;
    itemName: string;
    sizeSystem: string;
    sizeValue: string;
    categoryLarge: string;
    categorySmall: string;
    ootdVerifiedWearCount: number;
    wishCount: number;
    wished: boolean;
  };
  proposer: TradeUser;
  owner: TradeUser;
  amounts: ProposalAmounts;
  delivery: ProposalDelivery;
  tradeRequestNote: string | null;
  deliveryDisclosureStatus: DeliveryDisclosureStatus;
  paymentMethodId: string;
}

export interface IntentDetailResponse {
  intentId: number;
  status: ProposalStatus;
  viewerRole: IntentViewerRole;
  serverTime: string;
  expiresAt: string;
  remainingSeconds: number;
  paymentAuthorizationStatus: string;
  product: {
    productId: number;
    itemId: number;
    brandName: string;
    itemName: string;
    imageUrl: string | null;
  };
  buyer: TradeUser;
  seller: TradeUser;
  amounts: ProposalAmounts;
  delivery: ProposalDelivery;
  tradeRequestNote?: string | null;
  deliveryDisclosureStatus: DeliveryDisclosureStatus;
  paymentMethodId: string;
}
