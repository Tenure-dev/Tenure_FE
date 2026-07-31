export type ItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';

export type Item = {
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string;
  itemStatus: ItemStatus;
  ootdVerifiedWearCount: number;
  lastWornAt: string | null;
  purchaseOfferEnabled: boolean;
};

export type RegisteredItemListResponse = {
  content: Item[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type RegisteredItemListParams = {
  query?: string;
  itemStatus?: ItemStatus;
  page?: number;
  size?: number;
};

export type ItemHistoryApiEntry = {
  historyId: number;
  itemId: number;
  ownerUserId: number;
  acquisitionType: 'FIRST_REGISTERED' | 'TENURE_TRADE';
  endReason: 'TENURE_TRADE' | 'EXTERNAL_SALE' | null;
  startedAt: string;
  endedAt: string | null;
  tradeId: number | null;
};

export type ItemHistoryListResponse = {
  content: ItemHistoryApiEntry[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type HistoryOotdItem = {
  ootdId: number;
  imageUrl: string;
  createdAt: string;
};

export type HistoryOotdsResponse = {
  content: HistoryOotdItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type WearingTarget = 'MENSWEAR' | 'WOMENSWEAR' | 'UNISEX';

export type ItemDetailResponse = {
  itemId: number;
  ownerUserId: number;
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  wearingTarget: WearingTarget;
  sizeSystem: string;
  sizeValue: string;
  representativeImageUrl: string;
  itemStatus: ItemStatus;
  ootdVerifiedWearCount: number;
  lastWornAt: string | null;
  firstOwnedAt: string;
  wishCount: number;
  purchaseOfferEnabled: boolean;
  productId?: number | null;
  price?: number | null;
  saleStatus?: string | null;
};

export type FrequentlyWornItem = {
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string;
  togetherCount: number;
};

export type ItemDetail = ItemDetailResponse & {
  frequentlyWornWith: FrequentlyWornItem[];
};

export type ItemUpdateRequest = {
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  wearingTarget: WearingTarget;
  sizeSystem: string;
  sizeValue: string;
  firstOwnedAt: string;
  representativeImageUrl: string;
};

export type ItemUpdateResponse = ItemUpdateRequest & {
  itemId: number;
  ownerUserId: number;
  itemStatus: ItemStatus;
};

export type CreateProductResponse = {
  productId: number;
  itemId: number;
  sellerUserId: number;
  price: number;
  shippingFee: number;
  feePolicy: string;
  productStatus: string;
  itemStatus: string;
  attachedOotdIds: number[];
};

export type OfferSettingRequest = {
  purchaseOfferEnabled: boolean;
};

export type OfferSettingResponse = {
  itemId: number;
  purchaseOfferEnabled: boolean;
};

export interface CreateItemRequest {
  brandName: string;
  itemName: string;
  wearingTarget: WearingTarget;
  categoryLarge: string;
  categorySmall?: string;
  sizeSystem: 'KR';
  sizeValue?: string;
  firstOwnedAt?: string;
  representativeImageUrl?: string;
}

export interface CreateItemResponse {
  itemId: number;
  ownerUserId: number;
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string | null;
  wearingTarget: WearingTarget;
  sizeSystem: string;
  sizeValue: string | null;
  representativeImageUrl: string | null;
  itemStatus: string;
  firstOwnedAt: string | null;
}
