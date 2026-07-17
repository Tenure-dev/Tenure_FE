import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SegmentedControl, Toast } from '@/shared/components';
import FeedGrid from '@/shared/components/feed/FeedGrid';
import FollowAvatarRow from '@/features/feed/ui/FollowAvatarRow';
import FeedHeader from './components/FeedHeader';
import FeedIntro from './components/FeedIntro';
import { mockFeedItems, mockFollowedUsers } from '@/features/feed/model/mocks';
import type { FeedItem, FeedTab } from '@/features/feed/model/types';

const TABS: FeedTab[] = ['모두', '팔로우'];

const FeedPage = () => {
  const location = useLocation();
  const userName = '테뉴어';
  // OOTD 자동 태그 게시 후 진입 시 토스트, 게시글 생성흐름으로 인해 추가하였습니다.
  const [toast, setToast] = useState<string | null>(
    (location.state as { autoTagged?: boolean } | null)?.autoTagged
      ? '자동 태그되어 게시됨.'
      : null,
  );
  useEffect(() => {
    if (toast) window.history.replaceState({}, '');
  }, [toast]);
  const [activeTab, setActiveTab] = useState<FeedTab>('모두');
  const [items, setItems] = useState<FeedItem[]>(mockFeedItems);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)),
    );
  };

  const toggleBookmark = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item)),
    );
  };

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    setSelectedUserId(null);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const followedUserIds = useMemo(() => new Set(mockFollowedUsers.map((user) => user.id)), []);

  const visibleItems = useMemo(() => {
    if (activeTab === '모두') {
      return items;
    }

    if (selectedUserId) {
      return items.filter((item) => item.authorId === selectedUserId);
    }

    return items.filter((item) => followedUserIds.has(item.authorId));
  }, [items, activeTab, selectedUserId, followedUserIds]);

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
        <FeedGrid
          items={visibleItems}
          onToggleLike={toggleLike}
          onToggleBookmark={toggleBookmark}
        />
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-30 flex justify-center px-4">
          <Toast message={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default FeedPage;
