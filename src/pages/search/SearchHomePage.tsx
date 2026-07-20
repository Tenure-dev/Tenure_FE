import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchTopBar from '@/features/search/ui/SearchTopBar';
import RecommendedKeywords from '@/features/search/ui/RecommendedKeywords';
import RecentViewedUsers from '@/features/search/ui/RecentViewedUsers';
import RecentSearches from '@/features/search/ui/RecentSearches';
import RelatedKeywordList from '@/features/search/ui/RelatedKeywordList';
import CarouselSection from '@/features/search/ui/CarouselSection';
import PopularUsersSection from '@/features/search/ui/PopularUsersSection';
import FilterBottomSheet from '@/features/search/ui/FilterBottomSheet';
import {
  keywordSuggestionPool,
  newArrivalImages,
  popularUsers,
  RELATED_OOTD_ID,
  recentSearchesInitial,
  recentViewedUsersInitial,
  recommendedKeywords,
  similarToRecentImages,
  trendingStyleImages,
} from '@/features/search/model/mocks';
import {
  DEFAULT_SEARCH_FILTERS,
  isFiltersActive,
  type SearchFilters,
} from '@/features/search/model/types';

const buildRelatedKeywords = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const matches = keywordSuggestionPool.filter((k) => k.includes(trimmed) && k !== trimmed);
  return [trimmed, ...matches].slice(0, 8);
};

const SearchHomePage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [recentViewedUsers, setRecentViewedUsers] = useState(recentViewedUsersInitial);
  const [recentSearches, setRecentSearches] = useState(recentSearchesInitial);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const relatedKeywords = useMemo(() => buildRelatedKeywords(query), [query]);

  const goToResult = (keyword: string, nextFilters: SearchFilters) => {
    const trimmed = keyword.trim();
    if (trimmed) {
      setRecentSearches((prev) => {
        const withoutDup = prev.filter((item) => item.keyword !== trimmed);
        return [{ id: `rs-${Date.now()}`, keyword: trimmed }, ...withoutDup].slice(0, 10);
      });
    }
    navigate('/search/result', { state: { keyword: trimmed, filters: nextFilters } });
  };

  const handleSubmit = (keyword: string) => goToResult(keyword, filters);

  const handleBack = () => {
    setActive(false);
    setQuery('');
  };

  const handleFilterApply = (nextFilters: SearchFilters) => {
    setFilters(nextFilters);
    setActive(false);
    setQuery('');
  };

  return (
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <SearchTopBar
        value={query}
        onChange={setQuery}
        onFocus={() => setActive(true)}
        onBack={active ? handleBack : undefined}
        onSubmit={handleSubmit}
        onFilterClick={() => setFilterSheetOpen(true)}
        filterActive={isFiltersActive(filters)}
        autoFocus={active}
      />

      {active ? (
        <div className="flex-1 pb-10">
          {relatedKeywords.length > 0 ? (
            <RelatedKeywordList keywords={relatedKeywords} onSelect={handleSubmit} />
          ) : (
            <>
              <RecommendedKeywords keywords={recommendedKeywords} onSelect={handleSubmit} />
              <RecentViewedUsers
                users={recentViewedUsers}
                onRemove={(id) => setRecentViewedUsers((prev) => prev.filter((u) => u.id !== id))}
                onClearAll={() => setRecentViewedUsers([])}
              />
              <RecentSearches
                searches={recentSearches}
                onSelect={handleSubmit}
                onRemove={(id) => setRecentSearches((prev) => prev.filter((s) => s.id !== id))}
                onClearAll={() => setRecentSearches([])}
              />
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 pb-10">
          <CarouselSection
            title="방금 보신 OOTD와 유사한 게시물"
            subtitle="이런 스타일도 좋아할 수 있어요."
            images={similarToRecentImages}
            ootdId={RELATED_OOTD_ID}
          />
          <CarouselSection
            title="지금 인기 있는 스타일"
            subtitle="좋아요를 많이 받은 OOTD를 추천해요."
            images={trendingStyleImages}
            ootdId={RELATED_OOTD_ID}
          />
          <PopularUsersSection users={popularUsers} />
          <CarouselSection
            title="새로 올라온 OOTD"
            subtitle="최근 올라온 게시물을 빠르게 둘러보세요."
            images={newArrivalImages}
            ootdId={RELATED_OOTD_ID}
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
