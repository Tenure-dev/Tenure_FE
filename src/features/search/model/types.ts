import type { ApiGender, ApiItemStatus, ApiSortType } from '../api/types';

export type SaleStatusFilter = 'all' | 'onSaleIncluded' | 'onSaleOnly';
export type GenderFilter = 'all' | 'male' | 'female';
export type SortOption = 'recommend' | 'latest' | 'like' | 'view' | 'save';
export type ResultTab = 'post' | 'account';

export interface SearchFilters {
  saleStatus: SaleStatusFilter;
  gender: GenderFilter;
  categories: string[];
  heightRange: [number, number];
  weightRange: [number, number];
}

export const HEIGHT_RANGE_LIMIT: [number, number] = [0, 200];
export const WEIGHT_RANGE_LIMIT: [number, number] = [0, 150];

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  saleStatus: 'all',
  gender: 'all',
  categories: [],
  heightRange: HEIGHT_RANGE_LIMIT,
  weightRange: WEIGHT_RANGE_LIMIT,
};

export const isFiltersActive = (filters: SearchFilters) =>
  filters.saleStatus !== 'all' ||
  filters.gender !== 'all' ||
  filters.categories.length > 0 ||
  filters.heightRange[0] !== HEIGHT_RANGE_LIMIT[0] ||
  filters.heightRange[1] !== HEIGHT_RANGE_LIMIT[1] ||
  filters.weightRange[0] !== WEIGHT_RANGE_LIMIT[0] ||
  filters.weightRange[1] !== WEIGHT_RANGE_LIMIT[1];

const GENDER_TO_API: Record<GenderFilter, ApiGender | undefined> = {
  all: undefined,
  male: 'MALE',
  female: 'FEMALE',
};

const SORT_TO_API: Record<SortOption, ApiSortType> = {
  recommend: 'RECOMMEND',
  latest: 'LATEST',
  like: 'HEART',
  view: 'VIEW',
  save: 'SAVE',
};

// BE의 ItemStatus는 단일 값만 필터링 가능해 'onSaleIncluded'(판매중 포함)를 표현할 수 없음 -> 'all'과 동일하게 처리.
// 관련 논의는 project-api-integration 메모리 및 대화 말미의 BE 요청 목록 참고.
const SALE_STATUS_TO_API: Record<SaleStatusFilter, ApiItemStatus | undefined> = {
  all: undefined,
  onSaleIncluded: undefined,
  onSaleOnly: 'ON_SALE',
};

export const toApiGender = (gender: GenderFilter) => GENDER_TO_API[gender];
export const toApiSort = (sort: SortOption) => SORT_TO_API[sort];
export const toApiItemStatus = (saleStatus: SaleStatusFilter) => SALE_STATUS_TO_API[saleStatus];

export interface RecentViewedUser {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

export interface RecentSearchItem {
  id: number;
  keyword: string;
}
