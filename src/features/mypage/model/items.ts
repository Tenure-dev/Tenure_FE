export type ItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';

export type RegisteredItem = {
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
  content: RegisteredItem[];
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

export type WearingTarget = 'MENSWEAR' | 'WOMENSWEAR' | 'UNISEX';

export type RegisteredItemDetailResponse = {
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
};

export type RegisteredItemDetail = RegisteredItemDetailResponse & {
  frequentlyWornWith: string[];
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

export type OfferSettingRequest = {
  purchaseOfferEnabled: boolean;
};

export type OfferSettingResponse = {
  itemId: number;
  purchaseOfferEnabled: boolean;
};

export type WearingTarget = 'MENSWEAR' | 'WOMENSWEAR' | 'UNISEX';

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
