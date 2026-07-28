import type { ApiGender, ApiItemStatusFilter, ApiSortType } from '../api/types';

export type SaleStatusFilter = 'all' | 'onSaleIncluded' | 'onSaleOnly';
export type GenderFilter = 'all' | 'male' | 'female';
export type SortOption = 'recommend' | 'latest' | 'like' | 'view' | 'save';
export type ResultTab = 'post' | 'account';

export interface SearchFilters {
  saleStatus: SaleStatusFilter;
  gender: GenderFilter;
  categoryIds: number[];
  heightRange: [number, number];
  weightRange: [number, number];
}

export const HEIGHT_RANGE_LIMIT: [number, number] = [0, 200];
export const WEIGHT_RANGE_LIMIT: [number, number] = [0, 150];

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  saleStatus: 'all',
  gender: 'all',
  categoryIds: [],
  heightRange: HEIGHT_RANGE_LIMIT,
  weightRange: WEIGHT_RANGE_LIMIT,
};

export const isFiltersActive = (filters: SearchFilters) =>
  filters.saleStatus !== 'all' ||
  filters.gender !== 'all' ||
  filters.categoryIds.length > 0 ||
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

// BE의 ItemStatusFilter(ALL/ON_SALE_INCLUDED/ON_SALE_ONLY)에 맞춘 매핑.
const SALE_STATUS_TO_API: Record<SaleStatusFilter, ApiItemStatusFilter | undefined> = {
  all: undefined,
  onSaleIncluded: 'ON_SALE_INCLUDED',
  onSaleOnly: 'ON_SALE_ONLY',
};

export const toApiGender = (gender: GenderFilter) => GENDER_TO_API[gender];
export const toApiSort = (sort: SortOption) => SORT_TO_API[sort];
export const toApiItemStatusFilter = (saleStatus: SaleStatusFilter) =>
  SALE_STATUS_TO_API[saleStatus];

export interface RecentViewedUser {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

export interface RecentSearchItem {
  id: number;
  keyword: string;
}
