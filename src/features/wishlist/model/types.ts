import type { SaleStatus, TradeStatus } from '@/features/chat/model/types';

export type WishlistTab = '전체' | '판매중' | '거래중';

export interface WishlistItem {
  id: string;
  itemId: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  saleStatus: SaleStatus;
  tradeStatus: TradeStatus;
  sellerName: string;
  updatedAt: string;
  notifyEnabled: boolean;
}
