import { useMemo, useState } from 'react';
import { BackHeader } from '@/shared/components';
import { settings } from '@/shared/assets';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { mockNotifications } from '@/features/notification/model/mocks';
import { groupNotificationsByDate } from '@/features/notification/lib/groupByDate';
import type { NotificationFilter } from '@/features/notification/model/types';
import NotificationFilterChip from '@/features/notification/ui/NotificationFilterChip';
import NotificationRow from '@/features/notification/ui/NotificationRow';

const FILTERS: NotificationFilter[] = ['전체', '확인 필요', '아이템 소식', '거래 현황', '관심'];
const PAGE_SIZE = 10;

const NotificationPage = () => {
  const [filter, setFilter] = useState<NotificationFilter>('전체');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredItems = useMemo(
    () =>
      filter === '전체'
        ? mockNotifications
        : mockNotifications.filter((item) => item.category === filter),
    [filter],
  );

  const sortedItems = useMemo(
    () => [...filteredItems].sort((a, b) => b.createdAt - a.createdAt),
    [filteredItems],
  );

  const visibleItems = sortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < sortedItems.length;
  const groups = useMemo(() => groupNotificationsByDate(visibleItems), [visibleItems]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setVisibleCount((prev) => prev + PAGE_SIZE),
  });

  const handleFilterChange = (next: NotificationFilter) => {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="bg-bg-white mx-auto flex h-screen w-full max-w-md flex-col">
      <BackHeader
        title="알림"
        rightActions={
          <button type="button" onClick={() => {}} aria-label="알림 설정">
            <img src={settings} width={22} height={22} alt="" />
          </button>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {FILTERS.map((item) => (
          <NotificationFilterChip
            key={item}
            label={item}
            selected={filter === item}
            onClick={() => handleFilterChange(item)}
          />
        ))}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        {groups.map((group) => (
          <div key={group.label}>
            <h2 className="text-title-4 text-text-primary px-4 pt-2 pb-1 font-semibold">
              {group.label}
            </h2>
            <div className="divide-border-secondary divide-y">
              {group.items.map((item) => (
                <NotificationRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
        {hasMore && <div ref={sentinelRef} className="h-1" />}
      </div>
    </div>
  );
};

export default NotificationPage;
