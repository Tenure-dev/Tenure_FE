import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import UserProfileHeader from './component/UserProfileHeader';
import UserProfileSection from './component/UserProfileSection';
import UserProfileStats from './component/UserProfileStats';
import FollowButton from './component/FollowButton';
import UserFeed from './component/UserFeed';
import UserMoreSheet from './component/UserMoreSheet';
import { useUserFeedProfileQuery } from '@/features/user/model/useUserFeedProfileQuery';
import { followUser, unfollowUser } from '@/features/user/api/userApi';
import type { UserFeedProfileResponse } from '@/features/user/api/userApi';
import { useQueryClient } from '@tanstack/react-query';

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);

  const { userId } = useParams();
  const id = Number(userId);
  const { data: profile, isLoading } = useUserFeedProfileQuery(id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  // UI 단계: 팔로우·차단 상태는 로컬로만 토글 (API 연동은 다음 작업)
  const [following, setFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 서버의 팔로우 상태가 바뀌면(최초 로드/재조회) 로컬 state를 동기화 (effect 대신 렌더 중 이전값 비교)
  const [prevIsFollowing, setPrevIsFollowing] = useState<boolean | undefined>(undefined);
  if (profile && profile.isFollowing !== prevIsFollowing) {
    setPrevIsFollowing(profile.isFollowing);
    setFollowing(profile.isFollowing);
  }

  // 팔로우/언팔로우: 낙관적 토글 → 응답으로 확정, 실패 시 롤백. 프로필 캐시의 팔로워 수도 갱신.
  const handleToggleFollow = async () => {
    if (id <= 0) return;
    const next = !following;
    setFollowing(next);
    try {
      const res = next ? await followUser(id) : await unfollowUser(id);
      setFollowing(res.following);
      setPrevIsFollowing(res.following);
      queryClient.setQueryData<UserFeedProfileResponse>(['users', id, 'feed-profile'], (old) =>
        old ? { ...old, isFollowing: res.following, followerCount: res.followerCount } : old,
      );
    } catch {
      setFollowing(!next);
      showToast('요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  // 프로필 조회 전(첫 로딩)엔 스켈레톤 표시
  if (isLoading || !profile) {
    return (
      <div className="bg-bg-white text-text-primary mx-auto min-h-screen">
        <UserProfileHeader onMoreClick={() => setShowMore(true)} />
        <div className="animate-pulse">
          {/* 프로필 섹션 */}
          <div className="flex items-center gap-4 px-4 py-6">
            <div className="bg-bg-quaternary size-24 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="bg-bg-quaternary h-5 w-28 rounded" />
              <div className="bg-bg-quaternary h-4 w-40 rounded" />
            </div>
          </div>
          {/* 스탯 */}
          <div className="flex p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="bg-bg-quaternary h-5 w-8 rounded" />
                <div className="bg-bg-quaternary h-3 w-10 rounded" />
              </div>
            ))}
          </div>
          {/* 팔로우 버튼 */}
          <div className="px-4">
            <div className="bg-bg-quaternary h-11 w-full rounded-md" />
          </div>
          {/* 피드 그리드 */}
          <div className="mt-4 grid grid-cols-3 gap-1 px-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-bg-quaternary aspect-square rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen">
      <UserProfileHeader onMoreClick={() => setShowMore(true)} />
      <UserProfileSection
        name={profile.username}
        grade={profile.grade}
        height={profile.heightCm}
        weight={profile.weightKg}
        profileImageUrl={profile.profileImageUrl}
      />
      <UserProfileStats
        feed={profile.feedCount}
        item={profile.itemCount}
        follower={profile.followerCount}
        userId={id}
        username={profile.username}
      />
      g
      <FollowButton following={following} onToggle={handleToggleFollow} />
      <UserFeed userId={id} />
      <UserMoreSheet
        open={showMore}
        onClose={() => setShowMore(false)}
        isBlocked={isBlocked}
        onToggleBlock={setIsBlocked}
        onToast={showToast}
      />
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default UserProfilePage;
