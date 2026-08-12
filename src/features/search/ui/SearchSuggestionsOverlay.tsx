import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { getSuggestionKeywords } from '../api/searchApi';
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
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, 300);

  const { data: matchedKeywords = [] } = useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery],
    queryFn: () => getSuggestionKeywords(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30 * 1000,
  });

  const relatedKeywords = trimmedQuery
    ? [trimmedQuery, ...matchedKeywords.filter((k) => k !== trimmedQuery)].slice(0, 8)
    : [];

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
