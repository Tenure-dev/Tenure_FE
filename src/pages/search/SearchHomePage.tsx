import { useEffect, useMemo, useState } from 'react';
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
  deleteRecentUser,
  deleteRecentKeyword,
  getSearchHome,
  getSearchRecent,
} from '@/features/search/api/searchApi';
import type { SearchHomeData } from '@/features/search/api/types';
import type { RecentSearchItem, RecentViewedUser } from '@/features/search/model/types';
import {
  DEFAULT_SEARCH_FILTERS,
  isFiltersActive,
  type SearchFilters,
} from '@/features/search/model/types';

const buildRelatedKeywords = (query: string, suggestions: string[]) => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const matches = suggestions.filter((k) => k.includes(trimmed) && k !== trimmed);
  return [trimmed, ...matches].slice(0, 8);
};

const SearchHomePage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [recentViewedUsers, setRecentViewedUsers] = useState<RecentViewedUser[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [home, setHome] = useState<SearchHomeData | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    getSearchRecent().then((data) => {
      setRecentViewedUsers(
        data.recentUsers.map((u) => ({
          id: u.userId,
          name: u.username,
          avatarUrl: u.profileImageUrl,
        })),
      );
      setRecentSearches(data.recentKeywords.map((k) => ({ id: k.id, keyword: k.keyword })));
      setSuggestions(data.suggestions);
    });
    getSearchHome().then(setHome);
  }, []);

  const relatedKeywords = useMemo(
    () => buildRelatedKeywords(query, suggestions),
    [query, suggestions],
  );

  const goToResult = (keyword: string, nextFilters: SearchFilters) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => prev.filter((item) => item.keyword !== trimmed));
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

  const handleRemoveRecentUser = (id: number) => {
    setRecentViewedUsers((prev) => prev.filter((u) => u.id !== id));
    deleteRecentUser(id);
  };

  const handleClearAllRecentUsers = () => {
    const ids = recentViewedUsers.map((u) => u.id);
    setRecentViewedUsers([]);
    ids.forEach((id) => deleteRecentUser(id));
  };

  const handleRemoveRecentKeyword = (id: number) => {
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
    deleteRecentKeyword(id);
  };

  const handleClearAllRecentKeywords = () => {
    const ids = recentSearches.map((s) => s.id);
    setRecentSearches([]);
    ids.forEach((id) => deleteRecentKeyword(id));
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
              <RecommendedKeywords keywords={suggestions} onSelect={handleSubmit} />
              <RecentViewedUsers
                users={recentViewedUsers}
                onRemove={handleRemoveRecentUser}
                onClearAll={handleClearAllRecentUsers}
              />
              <RecentSearches
                searches={recentSearches}
                onSelect={handleSubmit}
                onRemove={handleRemoveRecentKeyword}
                onClearAll={handleClearAllRecentKeywords}
              />
            </>
          )}
        </div>
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
          <PopularUsersSection users={home?.popularUsers.content ?? []} />
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
