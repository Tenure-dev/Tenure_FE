import { useState } from 'react';
import { followUser, unfollowUser } from '../api/followApi';
import { getPopularUsers } from '../api/searchApi';
import type {
  PopularUserCursor,
  SearchHomePopularUserResponse,
  SearchUserResponse,
} from '../api/types';
import { getCurrentUserId } from '../lib/currentUser';
import { useCursorList } from '../lib/useCursorList';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';
import AccountResultRow from './AccountResultRow';

// BE의 인기 사용자 목록(SearchHomePopularUserResponse)은 following 여부를 내려주지 않아
// 항상 "팔로우"로 시작한다. 이미 팔로우한 사용자도 초기 상태가 틀릴 수 있음 — BE에 필드 추가 요청 필요.
const toSearchUser = (
  user: SearchHomePopularUserResponse,
  following: boolean,
): SearchUserResponse => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
  followerCount: user.followerCount,
  ootdCount: user.ootdCount,
  following,
});

const fetchPage = (cursor?: PopularUserCursor) => getPopularUsers(cursor, 20);

const PopularUsersMoreList = () => {
  const { items, hasNext, loading, loadMore } = useCursorList(fetchPage);
  const sentinelRef = useInfiniteScrollSentinel(hasNext, loadMore);
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());

  const toggleFollow = async (id: number) => {
    const currentlyFollowing = followingIds.has(id);
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (currentlyFollowing) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      const response = currentlyFollowing ? await unfollowUser(id) : await followUser(id);
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (response.following) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch {
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (currentlyFollowing) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  const currentUserId = getCurrentUserId();
  const visibleItems = items.filter((user) => user.id !== currentUserId);

  return (
    <div className="divide-border-secondary divide-y">
      {visibleItems.map((user) => (
        <AccountResultRow
          key={user.id}
          account={toSearchUser(user, followingIds.has(user.id))}
          onToggleFollow={toggleFollow}
        />
      ))}
      {hasNext && <div ref={sentinelRef} className="h-10" />}
      {loading && <p className="text-body-3 text-text-tertiary py-4 text-center">불러오는 중...</p>}
    </div>
  );
};

export default PopularUsersMoreList;
