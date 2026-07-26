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

export type ItemHistoryEntry = {
  userId: string;
  username: string;
  profileImageUrl: string;
  dateFrom: string;
  dateTo: string | null;
  ootdCount: number;
  isFirstOwner: boolean;
  ootdImages: string[];
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
  history: ItemHistoryEntry[];
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
