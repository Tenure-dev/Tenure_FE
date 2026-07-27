export type RegisteredItem = {
  id: string;
  imageUrl: string;
  brand: string;
  name: string;
  forSale: boolean;
  lastWornDaysAgo: number;
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

export type RegisteredItemDetail = {
  id: string;
  imageUrl: string;
  brand: string;
  name: string;
  forSale: boolean;
  category: string;
  subCategory: string;
  gender: string;
  size: string;
  interestedCount: number;
  lastWornDate: string;
  acquiredDate: string;
  frequentlyWornWith: string[];
  history: ItemHistoryEntry[];
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
