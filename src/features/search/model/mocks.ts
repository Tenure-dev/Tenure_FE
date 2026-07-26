import type { RecentSearchItem, RecentViewedUser, SearchAccount, SearchResultItem } from './types';
import { CATEGORY_GROUPS } from './categoryData';
import { mockOotdPost } from '@/features/ootd/model/mocks';

export const RELATED_OOTD_ID = String(mockOotdPost.id);

export const recommendedKeywords: string[] = [
  '데님 팬츠',
  '나이키 신발',
  'Levis 501',
  '가죽 자켓',
  '오버핏 후디',
  '와이드 슬랙스',
];

export const keywordSuggestionPool: string[] = [
  '반팔',
  '반팔 티셔츠',
  '오버핏 반팔',
  '반팔 셔츠',
  '반팔 니트',
  '데님 팬츠',
  '데님 자켓',
  '데님 스커트',
  '나이키 신발',
  '나이키 러닝화',
  'Levis 501',
  '가죽 자켓',
  '오버핏 후디',
  '와이드 슬랙스',
  '크롭 니트',
  '숄더백',
  '버킷햇',
];

export const recentViewedUsersInitial: RecentViewedUser[] = [
  { id: 'ru-1', name: '@songALL', subtext: '최신 게시물 4개' },
  { id: 'ru-2', name: '@seoyeon', subtext: '최신 게시물 1개' },
  { id: 'ru-3', name: '@minsu', subtext: '게시물 1시간 전' },
  { id: 'ru-4', name: '@yoon', subtext: '비활성화' },
];

export const recentSearchesInitial: RecentSearchItem[] = [
  { id: 'rs-1', keyword: '제이엘브' },
  { id: 'rs-2', keyword: '수아레' },
  { id: 'rs-3', keyword: '나이키 신발' },
];

export interface PopularUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export const popularUsers: PopularUser[] = [
  { id: 'pu-1', name: 'seoyeon', avatarUrl: 'https://picsum.photos/seed/popular-1/100/100' },
  { id: 'pu-2', name: 'seofjeof...', avatarUrl: 'https://picsum.photos/seed/popular-2/100/100' },
  { id: 'pu-3', name: '서연', avatarUrl: 'https://picsum.photos/seed/popular-3/100/100' },
  { id: 'pu-4', name: '오렌지까...', avatarUrl: 'https://picsum.photos/seed/popular-4/100/100' },
  { id: 'pu-5', name: 'eunhye', avatarUrl: 'https://picsum.photos/seed/popular-5/100/100' },
];

export const buildImageSeeds = (seed: string, count: number) =>
  Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/300/400`);

export const similarToRecentImages = buildImageSeeds('search-similar', 6);
export const trendingStyleImages = buildImageSeeds('search-trending', 6);
export const newArrivalImages = buildImageSeeds('search-new', 6);

export const mockSearchAccounts: SearchAccount[] = [
  { id: 'acc-1', name: '수진이야', followerCount: 101, postCount: 60, following: true },
  { id: 'acc-2', name: '수빈_', followerCount: 24000, postCount: 80, following: false },
  { id: 'acc-3', name: '수연로그', followerCount: 24000, postCount: 80, following: false },
  { id: 'acc-4', name: '수수한 옷장', followerCount: 24000, postCount: 80, following: true },
  { id: 'acc-5', name: 'songALL', followerCount: 512, postCount: 12, following: false },
  { id: 'acc-6', name: 'seoyeon', followerCount: 890, postCount: 45, following: true },
  { id: 'acc-7', name: '데님러버', followerCount: 3300, postCount: 27, following: false },
  { id: 'acc-8', name: '가죽자켓매니아', followerCount: 1200, postCount: 33, following: false },
];

const GENDERS: SearchResultItem['gender'][] = ['male', 'female', 'unisex'];
const SALE_STATUSES: SearchResultItem['saleStatus'][] = ['onSale', 'unlisted'];

const flatCategoryItems = CATEGORY_GROUPS.flatMap((group) => group.items);

const DEMO_KEYWORD_CYCLE = ['데님자켓', '긴팔 티셔츠', '숄더백', '데님 스커트'];

export const mockSearchResultItems: SearchResultItem[] = Array.from({ length: 48 }, (_, i) => {
  const category = flatCategoryItems[i % flatCategoryItems.length];
  const demoKeyword = DEMO_KEYWORD_CYCLE[i % DEMO_KEYWORD_CYCLE.length];

  return {
    id: `search-item-${i}`,
    imageUrl: `https://picsum.photos/seed/search-result-${i}/600/800`,
    liked: false,
    bookmarked: false,
    authorId: `search-author-${i % 8}`,
    category,
    gender: GENDERS[i % GENDERS.length],
    saleStatus: SALE_STATUSES[i % SALE_STATUSES.length],
    authorHeight: 155 + ((i * 7) % 45),
    authorWeight: 45 + ((i * 5) % 60),
    likeCount: (i * 37) % 500,
    viewCount: (i * 91) % 3000,
    saveCount: (i * 13) % 200,
    createdAt: Date.now() - i * 1000 * 60 * 60,
    keywords: [category, demoKeyword],
  };
});
