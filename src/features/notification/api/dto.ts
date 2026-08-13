export type ApiNotificationCategory = 'NEEDS_ACTION' | 'ITEM_NEWS' | 'TRADE_STATUS' | 'INTEREST';

export type ApiTargetType =
  | 'USER'
  | 'FOLLOW'
  | 'OOTD'
  | 'ITEM'
  | 'PRODUCT'
  | 'PURCHASE_INTENT'
  | 'PURCHASE_OFFER'
  | 'TRADE'
  | 'CHAT';

export interface NotificationDto {
  id: number;
  category: ApiNotificationCategory;
  type: string;
  body: string;
  targetType: ApiTargetType;
  targetId: number;
  read: boolean;
  createdAt: string;
  imageUrl: string | null;
  brandName: string | null;
  itemName: string | null;
  senderUsername: string | null;
}

export interface NotificationCursorResponseDto {
  content: NotificationDto[];
  nextCursorCreatedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}

export interface NotificationMarkReadResponseDto {
  id: number;
  targetType: ApiTargetType;
  targetId: number;
}
