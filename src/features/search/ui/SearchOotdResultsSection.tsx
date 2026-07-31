import { useCallback, useEffect, useRef, useState } from 'react';
import { heartOotd, saveOotd, unheartOotd, unsaveOotd } from '@/features/ootd/api/ootdApi';
import { searchOotds } from '../api/searchApi';
import type {
  OotdSearchCursor,
  OotdSearchPage,
  OotdSearchParams,
  SearchOotdResponse,
} from '../api/types';
import { useCursorList } from '../lib/useCursorList';
import type { SortOption } from '../model/types';
import CarouselSection from './CarouselSection';
import SearchOotdResultGrid from './SearchOotdResultGrid';
import SortDropdown from './SortDropdown';

// BE는 keyword와 categoryIds가 모두 비어있으면 400을 반환하므로, 유효하지 않으면 호출하지 않는다.
const isSearchable = (params: OotdSearchParams) =>
  (params.keyword?.trim() ?? '') !== '' || (params.categoryIds?.length ?? 0) > 0;

const EMPTY_PAGE: OotdSearchPage = { content: [], hasNext: false, nextCursor: {}, count: 0 };

export interface SearchOotdResultsSectionProps {
  params: OotdSearchParams;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  noResultSuggestions: { popular: SearchOotdResponse[]; fresh: SearchOotdResponse[] };
}

// key={JSON.stringify(params)}로 리마운트되어 검색 조건이 바뀔 때마다 처음부터 다시 조회한다.
const SearchOotdResultsSection = ({
  params,
  sort,
  onSortChange,
  noResultSuggestions,
}: SearchOotdResultsSectionProps) => {
  const fetchPage = useCallback(
    (cursor?: OotdSearchCursor) =>
      isSearchable(params) ? searchOotds(params, cursor) : Promise.resolve(EMPTY_PAGE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const { items, hasNext, loading, loadMore, lastPage } = useCursorList(fetchPage);
  const count = lastPage?.count ?? 0;

  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  // 서버가 내려준 초기 hearted/saved 값은 아이템당 한 번만 반영하고, 이후 로컬 토글을 덮어쓰지 않는다.
  const seededIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const newLiked: number[] = [];
    const newBookmarked: number[] = [];
    items.forEach((item) => {
      if (seededIdsRef.current.has(item.id)) return;
      seededIdsRef.current.add(item.id);
      if (item.hearted) newLiked.push(item.id);
      if (item.saved) newBookmarked.push(item.id);
    });
    if (newLiked.length > 0) {
      setLikedIds((prev) => new Set([...prev, ...newLiked]));
    }
    if (newBookmarked.length > 0) {
      setBookmarkedIds((prev) => new Set([...prev, ...newBookmarked]));
    }
  }, [items]);

  const toggleLike = async (id: number) => {
    const next = !likedIds.has(id);
    setLikedIds((prev) => {
      const set = new Set(prev);
      if (next) set.add(id);
      else set.delete(id);
      return set;
    });
    try {
      await (next ? heartOotd(id) : unheartOotd(id));
    } catch {
      setLikedIds((prev) => {
        const set = new Set(prev);
        if (next) set.delete(id);
        else set.add(id);
        return set;
      });
    }
  };

  const toggleBookmark = async (id: number) => {
    const next = !bookmarkedIds.has(id);
    setBookmarkedIds((prev) => {
      const set = new Set(prev);
      if (next) set.add(id);
      else set.delete(id);
      return set;
    });
    try {
      await (next ? saveOotd(id) : unsaveOotd(id));
    } catch {
      setBookmarkedIds((prev) => {
        const set = new Set(prev);
        if (next) set.delete(id);
        else set.add(id);
        return set;
      });
    }
  };

  if (items.length > 0) {
    return (
      <>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-body-2 text-text-secondary">총 게시물 {count}개</span>
          <SortDropdown value={sort} onChange={onSortChange} />
        </div>
        <div className="px-4 pb-8">
          <SearchOotdResultGrid
            items={items}
            hasNext={hasNext}
            loading={loading}
            onLoadMore={loadMore}
            likedIds={likedIds}
            bookmarkedIds={bookmarkedIds}
            onToggleLike={toggleLike}
            onToggleBookmark={toggleBookmark}
          />
        </div>
      </>
    );
  }

  if (loading) {
    return <p className="text-body-3 text-text-tertiary px-4 py-8 text-center">검색 중...</p>;
  }

  return (
    <div className="pb-10">
      <div className="px-4 py-8 text-left">
        <p className="text-body-1 text-text-primary font-semibold">검색 결과가 없어요.</p>
        <p className="text-body-3 text-text-tertiary mt-1">다른 키워드로 다시 검색해보세요.</p>
      </div>
      <CarouselSection
        title="지금 인기 있는 스타일"
        subtitle="좋아요를 많이 받은 OOTD를 추천해요."
        items={noResultSuggestions.popular}
        moreHref="/search/popular-ootds"
      />
      <CarouselSection
        title="새로 올라온 OOTD"
        subtitle="최근 올라온 게시물을 빠르게 둘러보세요."
        items={noResultSuggestions.fresh}
        moreHref="/search/new-ootds"
      />
    </div>
  );
};

export default SearchOotdResultsSection;
