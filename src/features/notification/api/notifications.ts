import { api } from '@/shared/lib/api';

interface NotificationItem {
  id: number;
  isRead: boolean;
}

interface NotificationListResponse {
  content: NotificationItem[];
  nextCursorCreatedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}

// 안 읽은 알림이 하나라도 있는지 (헤더 뱃지용). unreadOnly=true + size=1로 최소 조회.
export const getHasUnreadNotifications = async (): Promise<boolean> => {
  const res = await api.get<NotificationListResponse>('/notifications', {
    params: { unreadOnly: true, size: 1 },
  });
  return res.content.length > 0;
};
