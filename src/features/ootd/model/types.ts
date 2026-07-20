export type ItemStatus = '판매중' | '미판매';

export interface TagPosition {
  x: number;
  y: number;
}

export interface TaggedItem {
  id: string;
  brand: string;
  name: string;
  category: string;
  status: ItemStatus;
  price?: number;
  canOffer?: boolean;
  imageUrl?: string;
  position: TagPosition;
  closetItemId?: string;
}

export interface ClosetItem {
  id: string;
  brand: string;
  name: string;
  category: string;
  imageUrl: string;
  lastWornDaysAgo: number;
  verifiedCount: number;
}

export interface OotdAuthor {
  id: string;
  name: string;
  followerCount: number;
  feedCount: number;
}

export interface OotdPost {
  id: string;
  imageUrl: string;
  author: OotdAuthor;
  likeCount: number;
  bookmarkCount: number;
  liked: boolean;
  bookmarked: boolean;
  isOwner: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  taggedItems: TaggedItem[];
}

export const MAX_TAGGED_ITEMS = 5;

export const NEW_ITEM_ID = '__new_item__';

export const REPORT_REASONS = [
  '사람이 직접 착용한 OOTD가 아님',
  '부적절하거나 유해한 이미지',
  '도용한 사진 또는 관리 정책',
  '광고 또는 반복 게시물',
  '개인정보 노출',
  '서비스와 관련 없는 게시물',
] as const;
