import { useCallback } from 'react';
import { followUser, unfollowUser } from '../api/followApi';
import { searchUsers } from '../api/searchApi';
import type { UserSearchCursor, UserSearchPage } from '../api/types';
import { getCurrentUserId } from '../lib/currentUser';
import { useCursorList } from '../lib/useCursorList';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';
import AccountResultRow from './AccountResultRow';

const EMPTY_PAGE: UserSearchPage = { content: [], hasNext: false, nextCursor: {} };

export interface SearchAccountResultsSectionProps {
  keyword: string;
}

// key={keyword}로 리마운트되어 검색어가 바뀔 때마다 처음부터 다시 조회한다.
const SearchAccountResultsSection = ({ keyword }: SearchAccountResultsSectionProps) => {
  const trimmed = keyword.trim();

  const fetchPage = useCallback(
    (cursor?: UserSearchCursor) =>
      trimmed ? searchUsers(trimmed, cursor) : Promise.resolve(EMPTY_PAGE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const { items, setItems, hasNext, loading, loadMore } = useCursorList(fetchPage);
  const sentinelRef = useInfiniteScrollSentinel(hasNext, loadMore);

  const toggleFollow = async (id: number, currentlyFollowing: boolean) => {
    setItems((prev) =>
      prev.map((user) => (user.id === id ? { ...user, following: !currentlyFollowing } : user)),
    );
    try {
      const response = currentlyFollowing ? await unfollowUser(id) : await followUser(id);
      setItems((prev) =>
        prev.map((user) => (user.id === id ? { ...user, following: response.following } : user)),
      );
    } catch {
      // 실패 시 낙관적 업데이트를 되돌린다.
      setItems((prev) =>
        prev.map((user) => (user.id === id ? { ...user, following: currentlyFollowing } : user)),
      );
    }
  };

  const currentUserId = getCurrentUserId();
  const visibleItems = items.filter((account) => account.id !== currentUserId);

  if (visibleItems.length > 0) {
    return (
      <div className="divide-border-secondary divide-y">
        {visibleItems.map((account) => (
          <AccountResultRow
            key={account.id}
            account={account}
            onToggleFollow={(id) => toggleFollow(id, account.following)}
          />
        ))}
        {hasNext && <div ref={sentinelRef} className="h-10" />}
        {loading && (
          <p className="text-body-3 text-text-tertiary py-4 text-center">불러오는 중...</p>
        )}
      </div>
    );
  }

  if (loading) {
    return <p className="text-body-3 text-text-tertiary px-4 py-8 text-center">검색 중...</p>;
  }

  return (
    <div className="px-4 py-8 text-left">
      <p className="text-body-1 text-text-primary font-semibold">
        &apos;{trimmed}&apos;에 해당하는 유저가 없어요.
      </p>
      <p className="text-body-3 text-text-tertiary mt-1">다시 검색해주세요.</p>
    </div>
  );
};

export default SearchAccountResultsSection;
