import { create } from 'zustand';

export interface ShippingAddress {
  name: string;
  address: string;
  phone: string;
  request: string;
}

export type PaymentMethod = 'toss' | 'kakao' | 'naver';

interface OfferState {
  sellerNickname: string;
  price: number;
  shippingAddress: ShippingAddress | null;
  tradeRequest: string;
  paymentMethod: PaymentMethod;
  setSellerNickname: (nickname: string) => void;
  setPrice: (price: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setTradeRequest: (request: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  reset: () => void;
}

export const useOfferStore = create<OfferState>((set) => ({
  sellerNickname: '',
  price: 0,
  shippingAddress: null,
  tradeRequest: '',
  paymentMethod: 'toss',
  setSellerNickname: (sellerNickname) => set({ sellerNickname }),
  setPrice: (price) => set({ price }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setTradeRequest: (tradeRequest) => set({ tradeRequest }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  reset: () =>
    set({
      sellerNickname: '',
      price: 0,
      shippingAddress: null,
      tradeRequest: '',
      paymentMethod: 'toss',
    }),
}));
