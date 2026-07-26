import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
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

  // UI 단계: 팔로우·차단 상태는 로컬로만 토글 (API 연동은 다음 작업)
  const [following, setFollowing] = useState(userProfile.following);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen">
      <UserProfileHeader onMoreClick={() => setShowMore(true)} />
      <UserProfileSection />
      <UserProfileStats />
      <FollowButton following={following} onToggle={() => setFollowing((prev) => !prev)} />
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
