export type ChatRoomFilterType = 'ALL' | 'BUYING' | 'SELLING' | 'UNREAD';

export interface ChatRoomSummary {
  chatRoomId: number;
  opponentUsername: string;
  opponentProfileImgUrl: string | null;
  brandName: string;
  itemName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatRoomListResponse {
  content: ChatRoomSummary[];
  nextCursorLastMessageAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}
