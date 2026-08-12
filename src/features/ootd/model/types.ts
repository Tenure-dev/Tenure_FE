export type ItemStatus =
  '판매중' | '거래중' | '미판매_제안가능' | '미판매_제안불가' | '판매완료' | '삭제됨';

export interface Bbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TagPosition {
  x: number;
  y: number;
}

export interface TaggedItem {
  id: number;
  itemId: number;
  brand: string;
  name: string;
  category: string;
  status: ItemStatus;
  price?: number;
  imageUrl?: string;
  wished: boolean;
  position: TagPosition;
  bbox: Bbox;
}

export interface OotdAuthor {
  id: number;
  name: string;
  avatarUrl: string | null;
  followerCount: number;
  feedCount: number;
}

export interface OotdPost {
  id: number;
  imageUrl: string;
  author: OotdAuthor;
  likeCount: number;
  bookmarkCount: number;
  liked: boolean;
  bookmarked: boolean;
  isOwner: boolean;
  isFollowing: boolean;
  // 차단 API가 아직 없어(BE 요청 목록 참고) 로컬 상태로만 토글된다.
  isBlocked: boolean;
  taggedItems: TaggedItem[];
}

export const REPORT_REASONS = [
  '사람이 직접 착용한 OOTD가 아님',
  '부적절하거나 유해한 이미지',
  '도용한 사진 또는 권리 침해',
  '광고 또는 반복 게시물',
  '개인정보 노출',
  '서비스와 관련 없는 게시물',
] as const;
