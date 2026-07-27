import { useMemo } from 'react';
import { buildRelatedKeywords } from '../lib/buildRelatedKeywords';
import type { RecentSearchItem, RecentViewedUser } from '../model/types';
import RecentSearches from './RecentSearches';
import RecentViewedUsers from './RecentViewedUsers';
import RecommendedKeywords from './RecommendedKeywords';
import RelatedKeywordList from './RelatedKeywordList';

export interface SearchSuggestionsOverlayProps {
  query: string;
  suggestions: string[];
  recentViewedUsers: RecentViewedUser[];
  recentSearches: RecentSearchItem[];
  onSelectKeyword: (keyword: string) => void;
  onRemoveRecentUser: (id: number) => void;
  onClearAllRecentUsers: () => void;
  onRemoveRecentKeyword: (id: number) => void;
  onClearAllRecentKeywords: () => void;
}

// 검색창이 포커스됐을 때 뜨는 화면(입력 중 관련 검색어 vs 추천/최근 검색). 검색홈과 검색결과 화면이 공유한다.
const SearchSuggestionsOverlay = ({
  query,
  suggestions,
  recentViewedUsers,
  recentSearches,
  onSelectKeyword,
  onRemoveRecentUser,
  onClearAllRecentUsers,
  onRemoveRecentKeyword,
  onClearAllRecentKeywords,
}: SearchSuggestionsOverlayProps) => {
  const relatedKeywords = useMemo(
    () => buildRelatedKeywords(query, suggestions),
    [query, suggestions],
  );

  return (
    <div className="flex-1 pb-10">
      {relatedKeywords.length > 0 ? (
        <RelatedKeywordList keywords={relatedKeywords} onSelect={onSelectKeyword} />
      ) : (
        <>
          <RecommendedKeywords keywords={suggestions} onSelect={onSelectKeyword} />
          <RecentViewedUsers
            users={recentViewedUsers}
            onRemove={onRemoveRecentUser}
            onClearAll={onClearAllRecentUsers}
          />
          <RecentSearches
            searches={recentSearches}
            onSelect={onSelectKeyword}
            onRemove={onRemoveRecentKeyword}
            onClearAll={onClearAllRecentKeywords}
          />
        </>
      )}
    </div>
  );
};

export default SearchSuggestionsOverlay;
