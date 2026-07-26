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

export interface RecentViewedUser {
  id: string;
  name: string;
  subtext: string;
  avatarUrl?: string;
}

export interface RecentSearchItem {
  id: string;
  keyword: string;
}

export interface SearchResultItem {
  id: string;
  imageUrl: string;
  liked: boolean;
  bookmarked: boolean;
  authorId: string;
  category: string;
  gender: 'male' | 'female' | 'unisex';
  saleStatus: 'onSale' | 'unlisted';
  authorHeight: number;
  authorWeight: number;
  likeCount: number;
  viewCount: number;
  saveCount: number;
  createdAt: number;
  keywords: string[];
}

export interface SearchAccount {
  id: string;
  name: string;
  followerCount: number;
  postCount: number;
  following: boolean;
}
