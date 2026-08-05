import { useSearchParams } from 'react-router-dom';
import BackHeader from '@/shared/components/BackHeader';
import SegmentedControl from '@/shared/components/SegmentedControl';
import { useMyPage } from '@/features/mypage/api/useMyPage';
import {
  useMyFollowers,
  useMyFollowings,
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

  const { data: myPage } = useMyPage();
  const { data: followers = [], isPending: followersLoading } = useMyFollowers();
  const { data: followings = [], isPending: followingsLoading } = useMyFollowings();
  const { mutate: toggleFollow } = useToggleFollowInList();

  const list = activeTab === '팔로워' ? followers : followings;
  const isLoading = activeTab === '팔로워' ? followersLoading : followingsLoading;

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab: TAB_PARAM[tab as Tab] }, { replace: true });
  };

  return (
    <div className="bg-bg-white min-h-screen">
      <BackHeader title={myPage?.username ?? ''} />
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
