import { useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import BackHeader from '@/shared/components/BackHeader';
import SegmentedControl from '@/shared/components/SegmentedControl';
import { useMyPage } from '@/features/mypage/api/useMyPage';
import { useUserFeedProfileQuery } from '@/features/user/model/useUserFeedProfileQuery';
import {
  useFollowers,
  useFollowings,
  useToggleFollowInList,
} from '@/features/mypage/model/useFollowList';
import FollowUserItem from './component/FollowUserItem';

const TABS = ['팔로워', '팔로잉'] as const;
type Tab = (typeof TABS)[number];

const TAB_PARAM: Record<Tab, string> = {
  팔로워: 'followers',
  팔로잉: 'followings',
};

const PARAM_TAB: Record<string, Tab> = {
  followers: '팔로워',
  followings: '팔로잉',
};

const FollowListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: Tab = PARAM_TAB[searchParams.get('tab') ?? ''] ?? '팔로워';

  // userId 있으면 특정 유저 목록, 없으면(/mypage/follow) 내 목록.
  const { userId: userIdParam } = useParams();
  const location = useLocation();
  const scopeUserId = userIdParam ? Number(userIdParam) : undefined;

  const { data: myPage } = useMyPage();
  const { data: followers = [], isPending: followersLoading } = useFollowers(scopeUserId);
  const { data: followings = [], isPending: followingsLoading } = useFollowings(scopeUserId);
  const { mutate: toggleFollow } = useToggleFollowInList(scopeUserId);

  // 제목: 유저 목록이면 해당 유저 이름, 내 목록이면 내 이름.
  // 탭 전환 시 location.state가 사라지므로, 진입 시 이름을 ref로 잡아두고(첫 페인트용)
  // 프로필 쿼리 캐시(탭 전환·새로고침에도 유지)를 우선 사용한다.
  const [initialUsername] = useState(
    () => (location.state as { username?: string } | null)?.username ?? '',
  );
  const { data: userProfile } = useUserFeedProfileQuery(scopeUserId ?? 0);
  const title =
    scopeUserId != null ? userProfile?.username || initialUsername : (myPage?.username ?? '');

  const list = activeTab === '팔로워' ? followers : followings;
  const isLoading = activeTab === '팔로워' ? followersLoading : followingsLoading;

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab: TAB_PARAM[tab as Tab] }, { replace: true });
  };

  return (
    <div className="bg-bg-white min-h-screen">
      <BackHeader title={title} />
      <SegmentedControl tabs={[...TABS]} activeTab={activeTab} onChange={handleTabChange} />
      <div className="border-border-light border-t">
        {isLoading ? (
          <div className="text-body-2 text-text-disabled py-10 text-center">불러오는 중...</div>
        ) : list.length === 0 ? (
          <div className="text-body-2 text-text-secondary py-10 text-center">
            {activeTab === '팔로워' ? '아직 팔로워가 없습니다.' : '아직 팔로잉이 없습니다.'}
          </div>
        ) : (
          list.map((user) => (
            <FollowUserItem
              key={user.userId}
              userId={user.userId}
              username={user.username}
              profileImageUrl={user.profileImageUrl}
              following={user.following}
              onToggle={(userId, following) => toggleFollow({ userId, following })}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FollowListPage;
