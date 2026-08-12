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

export type ApiProductStatus = 'ON_SALE' | 'TRADING' | 'SOLD' | 'HIDDEN';

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

export interface OotdTagAnalyzeRequest {
  bbox: Bbox;
}

export interface OotdTagAnalyzeResponse {
  labelText: string | null;
  categoryLarge: string | null;
  categorySmall: string | null;
  matchedItemIds: number[];
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

// POST /ootds/{ootdId}/tags/batch — 기존 태그를 전부 삭제하고 이 목록으로 교체(모두 CONFIRMED).
// 최소 1개 이상이어야 함(빈 목록은 400).
export interface OotdTagBatchItem {
  itemId: number;
  bbox: Bbox;
  labelText: string;
}

export interface OotdTagBatchRequest {
  tags: OotdTagBatchItem[];
}

export interface OotdTagBatchResponse {
  ootdId: number;
  savedCount: number;
  tags: OotdTagResponse[];
}

export type ApiItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';
