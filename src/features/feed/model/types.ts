export interface FeedItem {
  id: string;
  imageUrl: string;
  liked: boolean;
  bookmarked: boolean;
  authorId: string;
}

export interface FollowedUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type FeedTab = '모두' | '팔로우';

export interface FeedCard {
  ootdId: number;
  imageUrl: string;
  createdAt: string;
  userId: number;
  username: string;
  profileImageUrl: string;
  heartCount: number;
  saveCount: number;
  hearted: boolean;
  saved: boolean;
}

export interface FeedResponse {
  content: FeedCard[];
  nextCursorCreatedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}

export interface FeedParams {
  tab?: 'all' | 'following';
  userId?: number;
  cursorCreatedAt?: string;
  cursorId?: number;
  size?: number;
}
