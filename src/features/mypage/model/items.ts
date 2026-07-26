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
