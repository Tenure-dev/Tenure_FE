import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BackHeader } from '@/shared/components';
import { settings } from '@/shared/assets';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import {
  getNotifications,
  markNotificationRead,
  type NotificationListCursor,
} from '@/features/notification/api/notifications';
import { groupNotificationsByDate } from '@/features/notification/lib/groupByDate';
import type { NotificationFilter } from '@/features/notification/model/types';
import NotificationFilterChip from '@/features/notification/ui/NotificationFilterChip';
import NotificationRow from '@/features/notification/ui/NotificationRow';

const FILTERS: NotificationFilter[] = ['전체', '확인 필요', '아이템 소식', '거래 현황', '관심'];

const NotificationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<NotificationFilter>('전체');

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['notifications', 'list', filter],
    queryFn: ({ pageParam }) => getNotifications(filter, pageParam),
    initialPageParam: undefined as NotificationListCursor | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const groups = useMemo(() => groupNotificationsByDate(items), [items]);

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(hasNextPage),
    onLoadMore: fetchNextPage,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'has-unread'] });
    },
  });

  return (
    <div className="bg-bg-white mx-auto flex h-screen w-full max-w-md flex-col">
      <BackHeader
        title="알림"
        rightActions={
          <button
            type="button"
            onClick={() => navigate('/settings/notifications')}
            aria-label="알림 설정"
          >
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
            onClick={() => setFilter(item)}
          />
        ))}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        {!isLoading && groups.length === 0 && (
          <p className="text-body-2 text-text-tertiary px-4 py-10 text-center">알림이 없습니다</p>
        )}
        {groups.map((group) => (
          <div key={group.label}>
            <h2 className="text-title-4 text-text-primary px-4 pt-2 pb-1 font-semibold">
              {group.label}
            </h2>
            <div className="divide-border-secondary divide-y">
              {group.items.map((item) => (
                <NotificationRow key={item.id} item={item} onRead={markReadMutation.mutate} />
              ))}
            </div>
          </div>
        ))}
        {hasNextPage && <div ref={sentinelRef} className="h-1" />}
      </div>
    </div>
  );
};

export default NotificationPage;
