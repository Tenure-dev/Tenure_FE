export type FeedRatio = '4:5' | '1:1' | '3:4';

export interface FeedItem {
  id: string;
  imageUrl: string;
  ratio: FeedRatio;
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
