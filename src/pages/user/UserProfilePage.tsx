import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';
import { userProfile } from './mock';
import UserProfileHeader from './component/UserProfileHeader';
import UserProfileSection from './component/UserProfileSection';
import UserProfileStats from './component/UserProfileStats';
import FollowButton from './component/FollowButton';
import UserFeed from './component/UserFeed';
import UserMoreSheet from './component/UserMoreSheet';

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);

  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  // 내 프로필이면 팔로우 버튼을 숨긴다 (라우트 userId === 내 userId)
  const { userId } = useParams();
  const isMe = userId != null && userId === localStorage.getItem(USER_ID_STORAGE_KEY);

  // UI 단계: 팔로우·차단 상태는 로컬로만 토글 (API 연동은 다음 작업)
  const [following, setFollowing] = useState(userProfile.following);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen">
      <UserProfileHeader onMoreClick={() => setShowMore(true)} />
      <UserProfileSection />
      <UserProfileStats />
      {!isMe && (
        <FollowButton following={following} onToggle={() => setFollowing((prev) => !prev)} />
      )}
      <UserFeed />

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
