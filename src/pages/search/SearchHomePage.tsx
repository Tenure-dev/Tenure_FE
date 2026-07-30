import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchUiStore } from '@/store/useSearchUiStore';
import SearchTopBar from '@/features/search/ui/SearchTopBar';
import SearchSuggestionsOverlay from '@/features/search/ui/SearchSuggestionsOverlay';
import CarouselSection from '@/features/search/ui/CarouselSection';
import PopularUsersSection from '@/features/search/ui/PopularUsersSection';
import FilterBottomSheet from '@/features/search/ui/FilterBottomSheet';
import { getSearchHome } from '@/features/search/api/searchApi';
import type { SearchHomeData } from '@/features/search/api/types';
import { getCurrentUserId } from '@/features/search/lib/currentUser';
import { useRecentSearchData } from '@/features/search/lib/useRecentSearchData';
import { useScrollToTop } from '@/features/search/lib/useScrollToTop';
import {
  DEFAULT_SEARCH_FILTERS,
  isFiltersActive,
  type SearchFilters,
} from '@/features/search/model/types';

const SearchHomePage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [home, setHome] = useState<SearchHomeData | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const recentData = useRecentSearchData();
  const setInputActive = useSearchUiStore((state) => state.setInputActive);

  useEffect(() => {
    getSearchHome().then(setHome);
  }, []);

  useEffect(() => {
    // 필터 바텀시트(z-40)가 BottomNavBar(z-50)에 가려지지 않도록,
    // 시트가 열려 있을 때도 입력 활성 상태와 동일하게 nav bar를 숨긴다.
    setInputActive(active || filterSheetOpen);
    return () => setInputActive(false);
  }, [active, filterSheetOpen, setInputActive]);

  const goToResult = (keyword: string, nextFilters: SearchFilters) => {
    const trimmed = keyword.trim();
    // BE는 keyword 또는 categoryIds 중 하나가 있으면 검색 가능 — 카테고리만 골랐다면
    // 키워드 없이 엔터를 쳐도 결과 화면으로 넘어가야 한다.
    if (!trimmed && nextFilters.categoryIds.length === 0) return;

    if (trimmed) recentData.consumeKeyword(trimmed);
    navigate('/search/result', { state: { keyword: trimmed, filters: nextFilters } });
  };

  const handleSubmit = (keyword: string) => goToResult(keyword, filters);

  const handleBack = () => {
    setActive(false);
    setQuery('');
  };

  // 필터는 적용만 하고 저장해둔다 — 결과 화면으로의 이동은 검색어를 입력(엔터)했을 때만 일어난다.
  const handleFilterApply = (nextFilters: SearchFilters) => {
    setFilters(nextFilters);
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <SearchTopBar
        value={query}
        onChange={setQuery}
        onFocus={() => {
          setActive(true);
          recentData.refresh();
        }}
        onBack={active ? handleBack : undefined}
        onSubmit={handleSubmit}
        onFilterClick={() => setFilterSheetOpen(true)}
        filterActive={isFiltersActive(filters)}
        autoFocus={active}
      />

      {active ? (
        <SearchSuggestionsOverlay
          query={query}
          suggestions={recentData.suggestions}
          recentViewedUsers={recentData.recentViewedUsers}
          recentSearches={recentData.recentSearches}
          onSelectKeyword={handleSubmit}
          onRemoveRecentUser={recentData.removeRecentUser}
          onClearAllRecentUsers={recentData.clearAllRecentUsers}
          onRemoveRecentKeyword={recentData.removeRecentKeyword}
          onClearAllRecentKeywords={recentData.clearAllRecentKeywords}
        />
      ) : (
        <div className="flex-1 pb-10">
          <CarouselSection
            title="방금 보신 OOTD와 유사한 게시물"
            subtitle="이런 스타일도 좋아할 수 있어요."
            items={home?.similarOotds.content ?? []}
            moreHref="/search/similar-ootds"
          />
          <CarouselSection
            title="지금 인기 있는 스타일"
            subtitle="좋아요를 많이 받은 OOTD를 추천해요."
            items={home?.popularOotds.content ?? []}
            moreHref="/search/popular-ootds"
          />
          <PopularUsersSection
            users={(home?.popularUsers.content ?? []).filter((u) => u.id !== getCurrentUserId())}
          />
          <CarouselSection
            title="새로 올라온 OOTD"
            subtitle="최근 올라온 게시물을 빠르게 둘러보세요."
            items={home?.newOotds.content ?? []}
            moreHref="/search/new-ootds"
          />
        </div>
      )}

      <FilterBottomSheet
        open={filterSheetOpen}
        filters={filters}
        onClose={() => setFilterSheetOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default SearchHomePage;
