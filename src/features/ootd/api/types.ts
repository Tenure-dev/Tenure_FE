export interface Bbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AuthorResponse {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  followerCount: number;
  feedCount: number;
  following: boolean;
}

export interface ItemInfoResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  representativeImageUrl: string | null;
}

export type ApiProductStatus = 'ON_SALE' | 'SOLD' | 'TRANSFERRED';

export interface TagInfoResponse {
  tagId: number;
  itemId: number;
  bboxX: number;
  bboxY: number;
  bboxWidth: number;
  bboxHeight: number;
  labelText: string;
  item: ItemInfoResponse;
  onSale: boolean;
  price: number | null;
  purchaseOfferEnabled: boolean;
  itemStatus: ApiItemStatus;
  productStatus: ApiProductStatus | null;
  wished: boolean;
}

export interface FollowResponse {
  targetUserId: number;
  following: boolean;
  followerCount: number;
}

export type OotdTagStatus = 'ANALYZING' | 'AUTO_UNCONFIRMED' | 'CONFIRMED';
export type OotdPublicationStatus = 'ACTIVE' | 'ARCHIVED';

export interface OotdDetailResponse {
  ootdId: number;
  imageUrl: string;
  source: 'CAMERA';
  tagStatus: OotdTagStatus;
  tagConfirmedAt: string | null;
  author: AuthorResponse;
  heartCount: number;
  saveCount: number;
  viewCount: number;
  hearted: boolean;
  saved: boolean;
  tags: TagInfoResponse[];
}

export interface OotdRelatedCardResponse {
  ootdId: number;
  imageUrl: string;
  createdAt: string;
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

export interface OotdRelatedItemSectionResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  ootds: OotdRelatedCardResponse[];
}

export interface OotdRelatedResponse {
  similarMood: OotdRelatedCardResponse[];
  sameItems: OotdRelatedItemSectionResponse[];
  recommended: OotdRelatedCardResponse[];
}

export interface OotdTagCreateRequest {
  itemId: number;
  bbox: Bbox;
  labelText: string;
  status: 'CONFIRMED';
}

export interface OotdTagUpdateRequest {
  itemId: number;
  bbox: Bbox;
  labelText: string;
}

export interface OotdTagResponse {
  tagId: number;
  ootdId: number;
  itemId: number;
  bboxX: number;
  bboxY: number;
  bboxWidth: number;
  bboxHeight: number;
  labelText: string;
  source: 'MANUAL' | 'AI';
  status: 'CONFIRMED' | 'AUTO_UNCONFIRMED';
  createdAt: string;
}

export interface OotdTagConfirmResponse {
  ootdId: number;
  tagStatus: OotdTagStatus;
  tagConfirmedAt: string | null;
  reviewRequired: boolean;
  publicationStatus: OotdPublicationStatus;
}

export type ApiItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';

export interface ItemListResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string | null;
  itemStatus: ApiItemStatus;
  ootdVerifiedWearCount: number;
  lastWornAt: string | null;
  purchaseOfferEnabled: boolean;
}

export interface ItemListPage {
  content: ItemListResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
