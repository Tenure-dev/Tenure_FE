import { api } from '@/shared/lib/api';
import type {
  NewOotdCursor,
  OotdCursorPage,
  OotdSearchCursor,
  OotdSearchPage,
  OotdSearchParams,
  PopularOotdCursor,
  PopularUserCursor,
  SearchHomeData,
  SearchHomePopularUserResponse,
  SearchOotdResponse,
  SearchRecentResponse,
  SearchUserResponse,
  SimilarOotdCursor,
  UserCursorPage,
  UserSearchCursor,
  UserSearchPage,
} from './types';

const DEFAULT_SIZE = 10;

interface SimilarOotdRawResponse {
  content: SearchOotdResponse[];
  hasNext: boolean;
  nextCursorPriority?: number;
  nextCursorId?: number;
}

interface PopularOotdRawResponse {
  content: SearchOotdResponse[];
  hasNext: boolean;
  nextCursorValue?: number;
  nextCursorSaveValue?: number;
  nextCursorId?: number;
}

interface NewOotdRawResponse {
  content: SearchOotdResponse[];
  hasNext: boolean;
  nextCursor?: string;
  nextCursorId?: number;
}

interface PopularUserRawResponse {
  content: SearchHomePopularUserResponse[];
  hasNext: boolean;
  nextCursorFollowerCount?: number;
  nextCursorId?: number;
}

const toSimilarPage = (data: SimilarOotdRawResponse): OotdCursorPage<SimilarOotdCursor> => ({
  content: data.content,
  hasNext: data.hasNext,
  nextCursor: { cursorPriority: data.nextCursorPriority, cursorId: data.nextCursorId },
});

const toPopularPage = (data: PopularOotdRawResponse): OotdCursorPage<PopularOotdCursor> => ({
  content: data.content,
  hasNext: data.hasNext,
  nextCursor: {
    cursorValue: data.nextCursorValue,
    cursorSaveValue: data.nextCursorSaveValue,
    cursorId: data.nextCursorId,
  },
});

const toNewPage = (data: NewOotdRawResponse): OotdCursorPage<NewOotdCursor> => ({
  content: data.content,
  hasNext: data.hasNext,
  nextCursor: { cursor: data.nextCursor, cursorId: data.nextCursorId },
});

const toPopularUserPage = (
  data: PopularUserRawResponse,
): UserCursorPage<SearchHomePopularUserResponse, PopularUserCursor> => ({
  content: data.content,
  hasNext: data.hasNext,
  nextCursor: { cursorFollowerCount: data.nextCursorFollowerCount, cursorId: data.nextCursorId },
});

export const getSimilarOotds = async (
  cursor?: SimilarOotdCursor,
  size = DEFAULT_SIZE,
): Promise<OotdCursorPage<SimilarOotdCursor>> => {
  const data = await api.get<SimilarOotdRawResponse>('/search/home/similar-ootds', {
    params: { ...cursor, size },
  });
  return toSimilarPage(data);
};

export const getPopularOotds = async (
  cursor?: PopularOotdCursor,
  size = DEFAULT_SIZE,
): Promise<OotdCursorPage<PopularOotdCursor>> => {
  const data = await api.get<PopularOotdRawResponse>('/search/home/popular-ootds', {
    params: { ...cursor, size },
  });
  return toPopularPage(data);
};

export const getNewOotds = async (
  cursor?: NewOotdCursor,
  size = DEFAULT_SIZE,
): Promise<OotdCursorPage<NewOotdCursor>> => {
  const data = await api.get<NewOotdRawResponse>('/search/home/new-ootds', {
    params: { ...cursor, size },
  });
  return toNewPage(data);
};

export const getPopularUsers = async (
  cursor?: PopularUserCursor,
  size = DEFAULT_SIZE,
): Promise<UserCursorPage<SearchHomePopularUserResponse, PopularUserCursor>> => {
  const data = await api.get<PopularUserRawResponse>('/search/home/popular-users', {
    params: { ...cursor, size },
  });
  return toPopularUserPage(data);
};

export const getSearchHome = async (): Promise<SearchHomeData> => {
  const data = await api.get<{
    similarOotds: SimilarOotdRawResponse;
    popularOotds: PopularOotdRawResponse;
    newOotds: NewOotdRawResponse;
    popularUsers: PopularUserRawResponse;
  }>('/search/home');

  return {
    similarOotds: toSimilarPage(data.similarOotds),
    popularOotds: toPopularPage(data.popularOotds),
    newOotds: toNewPage(data.newOotds),
    popularUsers: toPopularUserPage(data.popularUsers),
  };
};

export const getSearchRecent = (): Promise<SearchRecentResponse> => api.get('/search/recent');

export const deleteRecentKeyword = (keywordId: number): Promise<void> =>
  api.delete(`/search/recent-keywords/${keywordId}`);

export const deleteAllRecentKeywords = (): Promise<void> => api.delete('/search/recent-keywords');

export const deleteRecentUser = (userId: number): Promise<void> =>
  api.delete(`/search/recent-users/${userId}`);

export const deleteAllRecentUsers = (): Promise<void> => api.delete('/search/recent-users');

// 검색 결과에서 OOTD/유저를 클릭했을 때 "최근 본" 목록에 기록한다.
export const saveRecentOotd = (ootdId: number): Promise<void> =>
  api.post(`/search/recent-ootds/${ootdId}`);

export const saveRecentUser = (userId: number): Promise<void> =>
  api.post(`/search/recent-users/${userId}`);

const SEARCH_OOTDS_SIZE = 20;

export const searchOotds = async (
  params: OotdSearchParams,
  cursor?: OotdSearchCursor,
  size = SEARCH_OOTDS_SIZE,
): Promise<OotdSearchPage> => {
  const data = await api.get<{
    content: SearchOotdResponse[];
    nextCursorCreatedAt?: string;
    nextCursorValue?: number;
    nextCursorId?: number;
    hasNext: boolean;
    count: number;
  }>('/search/ootds', {
    params: {
      keyword: params.keyword || undefined,
      gender: params.gender,
      heightMin: params.heightMin,
      heightMax: params.heightMax,
      weightMin: params.weightMin,
      weightMax: params.weightMax,
      categoryIds: params.categoryIds,
      itemStatusFilter: params.itemStatusFilter,
      sort: params.sort,
      cursor: cursor?.cursor,
      cursorId: cursor?.cursorId,
      cursorValue: cursor?.cursorValue,
      size,
    },
    // BE(@RequestParam List<Long>)는 categoryIds=1&categoryIds=2 형태를 기대하는데,
    // axios 기본 직렬화는 categoryIds[]=1 형태라 바인딩이 안 된다. indexes: null로 대괄호를 뺀다.
    paramsSerializer: { indexes: null },
  });

  return {
    content: data.content,
    hasNext: data.hasNext,
    count: data.count,
    nextCursor: {
      cursor: data.nextCursorCreatedAt,
      cursorId: data.nextCursorId,
      cursorValue: data.nextCursorValue,
    },
  };
};

const SEARCH_USERS_SIZE = 20;

export const searchUsers = async (
  keyword: string,
  cursor?: UserSearchCursor,
  size = SEARCH_USERS_SIZE,
): Promise<UserSearchPage> => {
  const data = await api.get<{
    content: SearchUserResponse[];
    nextCursorId?: number;
    hasNext: boolean;
  }>('/search/users', {
    params: { keyword, cursorId: cursor?.cursorId, size },
  });

  return {
    content: data.content,
    hasNext: data.hasNext,
    nextCursor: { cursorId: data.nextCursorId },
  };
};
