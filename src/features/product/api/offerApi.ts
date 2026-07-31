import { api } from '@/shared/lib/api';

export interface CreateOfferRequest {
  offerPrice: number;
  deliveryAddressId: number;
  paymentMethodId: string;
  tradeRequestNote: string;
  agreement: boolean;
}

export interface CreateOfferResponse {
  offerId: number;
  status: string;
  expiresAt: string;
  remainingSeconds: number;
  paymentAuthorizationStatus: string;
  amounts: {
    productAmount: number;
    shippingFee: number;
    buyerServiceFee: number;
    sellerServiceFee: number;
    buyerPaymentAmount: number;
    sellerSettlementAmount: number;
  };
}

export const createOffer = (itemId: number, body: CreateOfferRequest) =>
  api.post<CreateOfferResponse>(`/items/${itemId}/offers`, body);
