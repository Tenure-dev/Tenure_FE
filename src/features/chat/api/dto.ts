export type ChatRoomFilterType = 'ALL' | 'BUYING' | 'SELLING' | 'UNREAD';
export type MessageType = 'TEXT' | 'IMAGE';

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

export interface ChatMessageRequest {
  messageType: MessageType;
  content?: string; // 텍스트 전송 처리
  imageUrl?: string; // 이미지 전송 처리
}

export interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  senderProfileImgUrl: string | null;
  messageType: MessageType;
  content: string | null;
  contentImageUrl: string | null;
  createdAt: string;
}
