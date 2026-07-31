import { api } from '@/shared/lib/api';

export interface CreatePurchaseIntentRequest {
  deliveryAddressId: number;
  paymentMethodId: string;
  agreement: boolean;
}

export interface CreatePurchaseIntentResponse {
  intentId: number;
  status: string;
  expiresAt: string;
  remainingSeconds: number;
  amounts: {
    productAmount: number;
    shippingFee: number;
    buyerServiceFee: number;
    sellerServiceFee: number;
    buyerPaymentAmount: number;
    sellerSettlementAmount: number;
  };
}

export const createPurchaseIntent = (productId: number, body: CreatePurchaseIntentRequest) =>
  api.post<CreatePurchaseIntentResponse>(`/products/${productId}/purchase-intents`, body);
