import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import SearchTopBar from '@/features/search/ui/SearchTopBar';
import SearchSuggestionsOverlay from '@/features/search/ui/SearchSuggestionsOverlay';
import AppliedFilterChips from '@/features/search/ui/AppliedFilterChips';
import FilterBottomSheet from '@/features/search/ui/FilterBottomSheet';
import SearchOotdResultsSection from '@/features/search/ui/SearchOotdResultsSection';
import SearchAccountResultsSection from '@/features/search/ui/SearchAccountResultsSection';
import { getNewOotds, getPopularOotds } from '@/features/search/api/searchApi';
import type { SearchOotdResponse } from '@/features/search/api/types';
import { useRecentSearchData } from '@/features/search/lib/useRecentSearchData';
import { useScrollToTop } from '@/features/search/lib/useScrollToTop';
import {
  DEFAULT_SEARCH_FILTERS,
  HEIGHT_RANGE_LIMIT,
  isFiltersActive,
  toApiGender,
  toApiItemStatusFilter,
  toApiSort,
  WEIGHT_RANGE_LIMIT,
  type ResultTab,
  type SearchFilters,
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

interface LocationState {
  keyword?: string;
  filters?: SearchFilters;
}

const SearchResultPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  // keyword: 실제 검색에 쓰이는 "확정된" 값. draftKeyword: 입력창에 바로 묶이는 값.
  // 이 둘을 분리해야 타이핑할 때마다 결과 섹션이 통째로 리마운트/재조회되는 걸 막을 수 있다.
  const [keyword, setKeyword] = useState(state?.keyword ?? '');
  const [draftKeyword, setDraftKeyword] = useState(state?.keyword ?? '');
  const [active, setActive] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(state?.filters ?? DEFAULT_SEARCH_FILTERS);
  const [tab, setTab] = useState<ResultTab>('post');
  const [sort, setSort] = useState<SortOption>('recommend');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [noResultSuggestions, setNoResultSuggestions] = useState<{
    popular: SearchOotdResponse[];
    fresh: SearchOotdResponse[];
  }>({ popular: [], fresh: [] });
  const recentData = useRecentSearchData();

  useEffect(() => {
    getPopularOotds(undefined, 6).then((page) =>
      setNoResultSuggestions((prev) => ({ ...prev, popular: page.content })),
    );
    getNewOotds(undefined, 6).then((page) =>
      setNoResultSuggestions((prev) => ({ ...prev, fresh: page.content })),
    );
  }, []);

  const ootdSearchParams = useMemo(
    () => ({
      keyword,
      gender: toApiGender(filters.gender),
      itemStatusFilter: toApiItemStatusFilter(filters.saleStatus),
      categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      heightMin:
        filters.heightRange[0] !== HEIGHT_RANGE_LIMIT[0] ? filters.heightRange[0] : undefined,
      heightMax:
        filters.heightRange[1] !== HEIGHT_RANGE_LIMIT[1] ? filters.heightRange[1] : undefined,
      weightMin:
        filters.weightRange[0] !== WEIGHT_RANGE_LIMIT[0] ? filters.weightRange[0] : undefined,
      weightMax:
        filters.weightRange[1] !== WEIGHT_RANGE_LIMIT[1] ? filters.weightRange[1] : undefined,
      sort: toApiSort(sort),
    }),
    [keyword, filters, sort],
  );
  const ootdSearchParamsKey = JSON.stringify(ootdSearchParams);

  const handleRemoveFilterPatch = (patch: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  // 검색창에서 엔터(또는 추천/최근 검색어 클릭) — 이때만 실제 검색이 실행된다.
  const commitSearch = (nextKeyword: string) => {
    const trimmed = nextKeyword.trim();
    if (!trimmed && filters.categoryIds.length === 0) return;

    if (trimmed) recentData.consumeKeyword(trimmed);
    setKeyword(trimmed);
    setDraftKeyword(trimmed);
    setActive(false);
  };

  const handleCancelEdit = () => {
    setDraftKeyword(keyword);
    setActive(false);
  };

  return (
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <SearchTopBar
        value={draftKeyword}
        onChange={setDraftKeyword}
        onFocus={() => {
          setActive(true);
          recentData.refresh();
        }}
        onBack={active ? handleCancelEdit : () => navigate(-1)}
        onSubmit={commitSearch}
        onFilterClick={() => setFilterSheetOpen(true)}
        filterActive={isFiltersActive(filters)}
        autoFocus={active}
      />

      {active ? (
        <SearchSuggestionsOverlay
          query={draftKeyword}
          suggestions={recentData.suggestions}
          recentViewedUsers={recentData.recentViewedUsers}
          recentSearches={recentData.recentSearches}
          onSelectKeyword={commitSearch}
          onRemoveRecentUser={recentData.removeRecentUser}
          onClearAllRecentUsers={recentData.clearAllRecentUsers}
          onRemoveRecentKeyword={recentData.removeRecentKeyword}
          onClearAllRecentKeywords={recentData.clearAllRecentKeywords}
        />
      ) : (
        <>
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
              <SearchOotdResultsSection
                key={ootdSearchParamsKey}
                params={ootdSearchParams}
                sort={sort}
                onSortChange={setSort}
                noResultSuggestions={noResultSuggestions}
              />
            </div>
          ) : (
            <div className="flex-1 pb-10">
              <SearchAccountResultsSection key={keyword} keyword={keyword} />
            </div>
          )}
        </>
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
