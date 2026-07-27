export type NotificationCategory = '확인 필요' | '아이템 소식' | '거래 현황' | '관심';
export type NotificationFilter = '전체' | NotificationCategory;

export interface NotificationItem {
  id: string;
  itemId: string;
  category: NotificationCategory;
  brand: string;
  name: string;
  message: string;
  imageUrl: string;
  createdAt: number;
  urgent: boolean;
}
