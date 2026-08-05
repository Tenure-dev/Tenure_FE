import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser } from '../api/followApi';
import { getPopularUsers } from '../api/searchApi';
import type { PopularUserCursor } from '../api/types';
import { getCurrentUserId } from '../lib/currentUser';
import { useCursorList } from '../lib/useCursorList';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';
import AccountResultRow from './AccountResultRow';

const fetchPage = (cursor?: PopularUserCursor) => getPopularUsers(cursor, 20);

const PopularUsersMoreList = () => {
  const navigate = useNavigate();
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
      setItems((prev) =>
        prev.map((user) => (user.id === id ? { ...user, following: currentlyFollowing } : user)),
      );
    }
  };

  const currentUserId = getCurrentUserId();
  const visibleItems = items.filter((user) => user.id !== currentUserId);

  return (
    <div className="divide-border-secondary divide-y">
      {visibleItems.map((user) => (
        <AccountResultRow
          key={user.id}
          account={user}
          onToggleFollow={(id) => toggleFollow(id, user.following)}
          onClick={(id) => navigate(`/users/${id}`)}
        />
      ))}
      {hasNext && <div ref={sentinelRef} className="h-10" />}
      {loading && <p className="text-body-3 text-text-tertiary py-4 text-center">불러오는 중...</p>}
    </div>
  );
};

export default PopularUsersMoreList;
