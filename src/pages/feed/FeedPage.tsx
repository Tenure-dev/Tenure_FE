import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SegmentedControl, Toast } from '@/shared/components';
import FeedGrid from '@/shared/components/feed/FeedGrid';
import { useToast } from '@/shared/hooks/useToast';
import FeedHeader from './components/FeedHeader';
import FeedIntro from './components/FeedIntro';

import FollowAvatarRow from '@/features/feed/ui/FollowAvatarRow';
import { mockFollowedUsers } from '@/features/feed/model/mocks';
import type { FeedCard, FeedTab } from '@/features/feed/model/types';
import { useFeedQuery } from '@/features/feed/model/useFeedQuery';

const TABS: FeedTab[] = ['모두', '팔로우'];

const FeedPage = () => {
  const userName = '테뉴어';
  const [activeTab, setActiveTab] = useState<FeedTab>('모두');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<
    Record<string, { hearted?: boolean; saved?: boolean }>
  >({});

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

  const { data } = useFeedQuery({
    tab: activeTab === '팔로우' ? 'following' : 'all',
  });

  const items = useMemo<FeedCard[]>(() => {
    return (data?.pages ?? []).flatMap((page) =>
      page.content.map((card) => ({
        ...card,
        hearted: overrides[card.ootdId]?.hearted ?? card.hearted,
        saved: overrides[card.ootdId]?.saved ?? card.saved,
      })),
    );
  }, [data, overrides]);

  const toggleLike = (id: string) => {
    setOverrides((prev) => {
      const card = data?.pages.flatMap((p) => p.content).find((c) => String(c.ootdId) === id);
      const current = prev[id]?.hearted ?? card?.hearted ?? false;
      return { ...prev, [id]: { ...prev[id], hearted: !current } };
    });
  };

  const toggleBookmark = (id: string) => {
    setOverrides((prev) => {
      const card = data?.pages.flatMap((p) => p.content).find((c) => String(c.ootdId) === id);
      const current = prev[id]?.saved ?? card?.saved ?? false;
      return { ...prev, [id]: { ...prev[id], saved: !current } };
    });
  };

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    setSelectedUserId(null);
    setOverrides({});
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <FeedHeader userName={userName} />

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
          users={mockFollowedUsers}
          selectedUserId={selectedUserId}
          onSelect={handleSelectUser}
        />
      )}

      <div className="bg-bg-tertiary flex-1 px-4 pt-4 pb-6 md:px-6">
        <FeedGrid items={items} onToggleLike={toggleLike} onToggleBookmark={toggleBookmark} />
      </div>

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default FeedPage;
