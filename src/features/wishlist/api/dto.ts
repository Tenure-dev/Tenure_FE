export type ApiProductStatus = 'ON_SALE' | 'TRADING' | 'SOLD' | 'HIDDEN';

/** GET /wishes 항목 */
export interface WishListItemDto {
  wishId: number;
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string | null;
  saleStatus: ApiProductStatus | null;
  price: number | null;
  sellerUsername: string | null;
  createdAt: string;
  purchaseOfferEnabled: boolean;
  notificationEnabled: boolean;
  wishCount: number;
}

/** GET /wishes 응답 (page 기반 페이지네이션) */
export interface WishListPageResponse {
  content: WishListItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface WishCreateResponseDto {
  wishId: number;
  itemId: number;
  userId: number;
  notificationEnabled: boolean;
  wishCount: number;
}

export interface WishDeleteResponseDto {
  itemId: number;
  userId: number;
  wishCount: number;
}

export interface WishNotificationUpdateResponseDto {
  itemId: number;
  userId: number;
  notificationEnabled: boolean;
}
