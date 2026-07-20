import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import MyPageFeed from './component/MyPageFeed';
import MyPageHeader from './component/MyPageHeader';
import ProfileActions from './component/ProfileAction';
import ProfileSection from './component/ProfileSection';
import ProfileStats from './component/ProfileStats';
import ProfileTabs from './component/ProfileTabs';

const MyPage = () => {
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

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md">
      <MyPageHeader />
      <ProfileSection />
      <ProfileStats />
      <ProfileActions />
      <ProfileTabs />
      <MyPageFeed />
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default MyPage;
