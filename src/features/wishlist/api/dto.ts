export type ApiProductStatus = 'ON_SALE' | 'TRADING' | 'SOLD' | 'HIDDEN';

/** GET /wishes 항목. BE가 판매자명/등록시각은 아직 내려주지 않는다 (BE 요청 목록 참고). */
export interface WishListItemDto {
  wishId: number;
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string | null;
  saleStatus: ApiProductStatus | null;
  price: number | null;
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
