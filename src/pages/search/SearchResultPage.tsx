import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import FeedGrid from '@/shared/components/feed/FeedGrid';
import type { FeedItem } from '@/features/feed/model/types';
import SearchTopBar from '@/features/search/ui/SearchTopBar';
import AppliedFilterChips from '@/features/search/ui/AppliedFilterChips';
import SortDropdown from '@/features/search/ui/SortDropdown';
import FilterBottomSheet from '@/features/search/ui/FilterBottomSheet';
import CarouselSection from '@/features/search/ui/CarouselSection';
import AccountResultRow from '@/features/search/ui/AccountResultRow';
import {
  filterAccounts,
  filterSearchItems,
  sortSearchItems,
} from '@/features/search/lib/filterItems';
import {
  mockSearchAccounts,
  mockSearchResultItems,
  newArrivalImages,
  RELATED_OOTD_ID,
  trendingStyleImages,
} from '@/features/search/model/mocks';
import {
  DEFAULT_SEARCH_FILTERS,
  isFiltersActive,
  type ResultTab,
  type SearchFilters,
  type SearchResultItem,
  type SortOption,
} from '@/features/search/model/types';

const RESULT_TABS = ['게시물', '계정'] as const;
const TAB_TO_KEY: Record<(typeof RESULT_TABS)[number], ResultTab> = {
  게시물: 'post',
  계정: 'account',
};
const KEY_TO_TAB: Record<ResultTab, (typeof RESULT_TABS)[number]> = {
  post: '게시물',
  account: '계정',
};

const toFeedItem = (item: SearchResultItem): FeedItem => ({
  id: item.id,
  imageUrl: item.imageUrl,
  ratio: item.ratio,
  liked: item.liked,
  bookmarked: item.bookmarked,
  authorId: item.authorId,
});

interface LocationState {
  keyword?: string;
  filters?: SearchFilters;
}

const SearchResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const [keyword, setKeyword] = useState(state?.keyword ?? '');
  const [filters, setFilters] = useState<SearchFilters>(state?.filters ?? DEFAULT_SEARCH_FILTERS);
  const [tab, setTab] = useState<ResultTab>('post');
  const [sort, setSort] = useState<SortOption>('recommend');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [resultItems, setResultItems] = useState(mockSearchResultItems);
  const [accounts, setAccounts] = useState(mockSearchAccounts);

  const filteredItems = useMemo(
    () => filterSearchItems(resultItems, keyword, filters),
    [resultItems, keyword, filters],
  );
  const sortedItems = useMemo(() => sortSearchItems(filteredItems, sort), [filteredItems, sort]);
  const feedItems = useMemo(() => sortedItems.map(toFeedItem), [sortedItems]);

  const filteredAccounts = useMemo(() => filterAccounts(accounts, keyword), [accounts, keyword]);

  const toggleLike = (id: string) => {
    setResultItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)),
    );
  };

  const toggleBookmark = (id: string) => {
    setResultItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item)),
    );
  };

  const toggleFollow = (id: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, following: !account.following } : account,
      ),
    );
  };

  const handleRemoveFilterPatch = (patch: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <SearchTopBar
        value={keyword}
        onChange={setKeyword}
        onBack={() => navigate(-1)}
        onSubmit={setKeyword}
        onFilterClick={() => setFilterSheetOpen(true)}
        filterActive={isFiltersActive(filters)}
      />

      <div className="sticky top-[68px] z-10">
        <SegmentedControl
          tabs={[...RESULT_TABS]}
          activeTab={KEY_TO_TAB[tab]}
          onChange={(next) => setTab(TAB_TO_KEY[next as (typeof RESULT_TABS)[number]])}
        />
      </div>

      <AppliedFilterChips filters={filters} onRemove={handleRemoveFilterPatch} />

      {tab === 'post' ? (
        <div className="flex-1">
          {feedItems.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-body-2 text-text-secondary">
                  총 게시물 {feedItems.length}개
                </span>
                <SortDropdown value={sort} onChange={setSort} />
              </div>
              <div className="px-4 pb-8">
                <FeedGrid
                  items={feedItems}
                  onToggleLike={toggleLike}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
            </>
          ) : (
            <div className="pb-10">
              <div className="px-4 py-8 text-left">
                <p className="text-body-1 text-text-primary font-semibold">검색 결과가 없어요.</p>
                <p className="text-body-3 text-text-tertiary mt-1">
                  다른 키워드로 다시 검색해보세요.
                </p>
              </div>
              <CarouselSection
                title="지금 인기 있는 스타일"
                subtitle="좋아요를 많이 받은 OOTD를 추천해요."
                images={trendingStyleImages}
                ootdId={RELATED_OOTD_ID}
              />
              <CarouselSection
                title="새로 올라온 OOTD"
                subtitle="최근 올라온 게시물을 빠르게 둘러보세요."
                images={newArrivalImages}
                ootdId={RELATED_OOTD_ID}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 pb-10">
          {filteredAccounts.length > 0 ? (
            <div className="divide-border-secondary divide-y">
              {filteredAccounts.map((account) => (
                <AccountResultRow
                  key={account.id}
                  account={account}
                  onToggleFollow={toggleFollow}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-left">
              <p className="text-body-1 text-text-primary font-semibold">
                &apos;{keyword}&apos;에 해당하는 유저가 없어요.
              </p>
              <p className="text-body-3 text-text-tertiary mt-1">다시 검색해주세요.</p>
            </div>
          )}
        </div>
      )}

      <FilterBottomSheet
        open={filterSheetOpen}
        filters={filters}
        onClose={() => setFilterSheetOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
};

export default SearchResultPage;
