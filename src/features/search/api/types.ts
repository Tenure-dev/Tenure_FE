export interface SearchOotdResponse {
  id: number;
  imageUrl: string;
}

export interface OotdCursorPage<TCursor> {
  content: SearchOotdResponse[];
  hasNext: boolean;
  nextCursor: TCursor;
}

export interface SimilarOotdCursor {
  cursorPriority?: number;
  cursorId?: number;
}

export interface PopularOotdCursor {
  cursorValue?: number;
  cursorSaveValue?: number;
  cursorId?: number;
}

export interface NewOotdCursor {
  cursor?: string;
  cursorId?: number;
}

export interface PopularUserCursor {
  cursorFollowerCount?: number;
  cursorId?: number;
}

export interface SearchHomePopularUserResponse {
  id: number;
  username: string;
  profileImageUrl: string | null;
}

export interface UserCursorPage<TUser, TCursor> {
  content: TUser[];
  hasNext: boolean;
  nextCursor: TCursor;
}

export interface SearchHomeData {
  similarOotds: OotdCursorPage<SimilarOotdCursor>;
  popularOotds: OotdCursorPage<PopularOotdCursor>;
  newOotds: OotdCursorPage<NewOotdCursor>;
  popularUsers: UserCursorPage<SearchHomePopularUserResponse, PopularUserCursor>;
}

export interface RecentUserResponse {
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

export interface RecentKeywordResponse {
  id: number;
  keyword: string;
}

export interface SearchRecentResponse {
  recentUsers: RecentUserResponse[];
  recentKeywords: RecentKeywordResponse[];
  suggestions: string[];
}

export interface SearchUserResponse {
  id: number;
  username: string;
  profileImageUrl: string | null;
  followerCount: number;
  ootdCount: number;
  // BE의 SearchUserResponse는 필드명이 isFollowing이 아니라 following으로 직렬화된다
  // (Lombok의 boolean isFollowing 필드 -> Jackson bean getter 규칙으로 "following"이 됨).
  following: boolean;
}

export interface UserSearchCursor {
  cursorId?: number;
}

export interface UserSearchPage {
  content: SearchUserResponse[];
  hasNext: boolean;
  nextCursor: UserSearchCursor;
}

export type ApiGender = 'MALE' | 'FEMALE';
export type ApiItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';
export type ApiSortType = 'LATEST' | 'HEART' | 'SAVE' | 'VIEW' | 'RECOMMEND';

export interface OotdSearchParams {
  keyword: string;
  gender?: ApiGender;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  categoryIds?: number[];
  itemStatus?: ApiItemStatus;
  sort: ApiSortType;
}

export interface OotdSearchCursor {
  cursor?: string;
  cursorId?: number;
  cursorValue?: number;
}

export interface OotdSearchPage {
  content: SearchOotdResponse[];
  hasNext: boolean;
  nextCursor: OotdSearchCursor;
  count: number;
}
