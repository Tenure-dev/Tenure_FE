import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SegmentedControl, Toast } from '@/shared/components';
import FeedGrid from '@/shared/components/feed/FeedGrid';
import { useToast } from '@/shared/hooks/useToast';
import FeedHeader from './components/FeedHeader';
import FeedIntro from './components/FeedIntro';

import FollowAvatarRow from '@/features/feed/ui/FollowAvatarRow';
import type { FeedCard, FeedTab } from '@/features/feed/model/types';
import { useFeedQuery } from '@/features/feed/model/useFeedQuery';
import { useFollowings } from '@/features/feed/model/useFollowings';
import { useProfileStore } from '@/store/useProfileStore';

const TABS: FeedTab[] = ['모두', '팔로우'];

const FeedPage = () => {
  const { name: userName } = useProfileStore();
  const [activeTab, setActiveTab] = useState<FeedTab>('모두');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
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

  const { data: followings = [] } = useFollowings();

  const { data } = useFeedQuery({
    tab: activeTab === '팔로우' ? 'following' : 'all',
    userId: selectedUserId ? Number(selectedUserId) : undefined,
  });

  const items = useMemo<FeedCard[]>(
    () => (data?.pages ?? []).flatMap((page) => page.content),
    [data],
  );

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    setSelectedUserId(null);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <FeedHeader userName={userName} onNotificationClick={() => navigate('/notifications')} />

      <FeedIntro />

      <div className="sticky top-13.5 z-20">
        <SegmentedControl
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tab) => handleTabChange(tab as FeedTab)}
        />
      </div>

      {activeTab === '팔로우' && (
        <FollowAvatarRow
          users={followings}
          selectedUserId={selectedUserId}
          onSelect={handleSelectUser}
        />
      )}

      <div className="bg-bg-tertiary flex-1 px-4 pt-4 pb-6 md:px-6">
        <FeedGrid items={items} />
      </div>

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default FeedPage;
