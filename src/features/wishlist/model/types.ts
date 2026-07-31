import type { ApiProductStatus } from '../api/dto';

export type WishlistTab = '전체' | '판매중' | '거래중';

export interface WishlistItem {
  wishId: number;
  itemId: number;
  brand: string;
  name: string;
  price: number | null;
  imageUrl: string;
  saleStatus: ApiProductStatus | null;
  sellerUsername: string | null;
  wishedDaysAgo: number;
  purchaseOfferEnabled: boolean;
  notifyEnabled: boolean;
}
