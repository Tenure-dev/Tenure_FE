import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { useMyPage } from '@/features/mypage/api/useMyPage';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { FeedTab } from '@/features/mypage/api/useMyFeed';
import { useProfileStore } from '@/store/useProfileStore';
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

  // 서버 프로필을 스토어에 주입한다.
  // 응답이 오기 전/실패 시에는 스토어의 기존 값(목업)이 그대로 유지된다.
  const { data: myPage } = useMyPage();
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    if (!myPage) return;
    // 서버가 null을 준 값은 덮어쓰지 않는다 (기존 값 유지)
    setProfile({
      name: myPage.username,
      photoUrl: myPage.profileImageUrl ? resolveFileUrl(myPage.profileImageUrl) : null,
      ...(myPage.heightCm != null && { height: myPage.heightCm }),
      ...(myPage.weightKg != null && { weight: myPage.weightKg }),
    });
  }, [myPage, setProfile]);

  // 탭 상태를 여기서 들고 탭바·피드에 함께 내려준다.
  const [activeTab, setActiveTab] = useState<FeedTab>('게시물');

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen">
      <MyPageHeader />
      <ProfileSection />
      <ProfileStats />
      <ProfileActions />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      <MyPageFeed active={activeTab} />
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default MyPage;
