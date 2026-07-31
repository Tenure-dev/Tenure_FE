export interface SearchOotdResponse {
  id: number;
  imageUrl: string;
  // /search/ootds(키워드/카테고리 검색) 응답에만 내려온다. 홈 캐러셀(유사/인기/신규) 응답에는 없다.
  hearted?: boolean;
  saved?: boolean;
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
  followerCount: number;
  ootdCount: number;
  following: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  parentId: number | null;
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
export type ApiItemStatusFilter = 'ALL' | 'ON_SALE_INCLUDED' | 'ON_SALE_ONLY';
export type ApiSortType = 'LATEST' | 'HEART' | 'SAVE' | 'VIEW' | 'RECOMMEND';

export interface OotdSearchParams {
  // BE는 keyword 또는 categoryIds 중 하나가 있으면 됨(둘 다 없으면 400).
  keyword?: string;
  gender?: ApiGender;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  categoryIds?: number[];
  itemStatusFilter?: ApiItemStatusFilter;
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
