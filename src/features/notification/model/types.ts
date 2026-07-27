import type { ApiTargetType } from '../api/dto';

export type NotificationCategory = '확인 필요' | '아이템 소식' | '거래 현황' | '관심';
export type NotificationFilter = '전체' | NotificationCategory;

export interface NotificationItem {
  id: number;
  category: NotificationCategory;
  message: string;
  imageUrl: string;
  brandName: string | null;
  itemName: string | null;
  senderUsername: string | null;
  isRead: boolean;
  urgent: boolean;
  createdAt: number;
  targetType: ApiTargetType;
  targetId: number;
}
