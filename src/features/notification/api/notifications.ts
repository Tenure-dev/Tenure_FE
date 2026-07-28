import { api } from '@/shared/lib/api';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { NotificationCategory, NotificationFilter, NotificationItem } from '../model/types';
import type {
  ApiNotificationCategory,
  NotificationCursorResponseDto,
  NotificationDto,
  NotificationMarkReadResponseDto,
} from './dto';

const FILTER_TO_CATEGORY: Record<Exclude<NotificationFilter, '전체'>, ApiNotificationCategory> = {
  '확인 필요': 'NEEDS_ACTION',
  '아이템 소식': 'ITEM_NEWS',
  '거래 현황': 'TRADE_STATUS',
  관심: 'INTEREST',
};

const CATEGORY_LABEL: Record<ApiNotificationCategory, NotificationCategory> = {
  NEEDS_ACTION: '확인 필요',
  ITEM_NEWS: '아이템 소식',
  TRADE_STATUS: '거래 현황',
  INTEREST: '관심',
};

const toNotificationItem = (dto: NotificationDto): NotificationItem => ({
  id: dto.id,
  category: CATEGORY_LABEL[dto.category],
  message: dto.body,
  imageUrl: dto.imageUrl ? resolveFileUrl(dto.imageUrl) : null,
  brandName: dto.brandName,
  itemName: dto.itemName,
  senderUsername: dto.senderUsername,
  isRead: dto.isRead,
  urgent: dto.category === 'NEEDS_ACTION',
  createdAt: new Date(dto.createdAt).getTime(),
  targetType: dto.targetType,
  targetId: dto.targetId,
});

/** 다음 페이지를 가리키는 커서 (첫 페이지는 커서 없음) */
export type NotificationListCursor = { createdAt: string; id: number };

export interface NotificationListPageResult {
  items: NotificationItem[];
  nextCursor: NotificationListCursor | null;
}

export const getNotifications = async (
  filter: NotificationFilter,
  cursor?: NotificationListCursor,
): Promise<NotificationListPageResult> => {
  const data = await api.get<NotificationCursorResponseDto>('/notifications', {
    params: {
      category: filter === '전체' ? undefined : FILTER_TO_CATEGORY[filter],
      size: 10,
      // 첫 페이지는 커서를 안 보낸다
      ...(cursor && { cursor: cursor.createdAt, cursorId: cursor.id }),
    },
  });

  return {
    items: data.content.map(toNotificationItem),
    nextCursor:
      data.hasNext && data.nextCursorCreatedAt != null && data.nextCursorId != null
        ? { createdAt: data.nextCursorCreatedAt, id: data.nextCursorId }
        : null,
  };
};

// 안 읽은 알림이 하나라도 있는지 (헤더 뱃지용). unreadOnly=true + size=1로 최소 조회.
export const getHasUnreadNotifications = async (): Promise<boolean> => {
  const res = await api.get<NotificationCursorResponseDto>('/notifications', {
    params: { unreadOnly: true, size: 1 },
  });
  return res.content.length > 0;
};

export const markNotificationRead = (notificationId: number) =>
  api.post<NotificationMarkReadResponseDto>(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () => api.post<void>('/notifications/read-all');
