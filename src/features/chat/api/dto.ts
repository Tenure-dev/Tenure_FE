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
  imageUrls?: string[]; // 이미지 전송 처리 (백엔드가 리스트로 받음)
}

export interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  senderProfileImgUrl: string | null;
  messageType: MessageType;
  content: string | null;
  contentImageUrls: string[] | null;
  createdAt: string;
}

export interface ChatMessageListResponse {
  chatMessages: ChatMessageResponse[];
  nextCursor: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}

export interface ChatImageUploadResponse {
  imageUrls: string[];
}

export type ProductStatus = 'ON_SALE' | 'TRADING' | 'SOLD' | 'HIDDEN';

// GET /chats/{chatRoomId} 응답 (프로덕트 바용)
// 주의: 백엔드 boolean 필드 isBuyer → JSON은 buyer 로 옴
export interface ChatRoomDetailResponse {
  chatRoomId: number;
  opponentUsername: string;
  opponentProfileImage: string | null;
  itemImageUrl: string | null;
  brandName: string;
  itemName: string;
  productStatus: ProductStatus;
  price: number;
  lastWornAt: string | null;
  tradeId: number | null;
  productId: number;
  buyer: boolean;
}
