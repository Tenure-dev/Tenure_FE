import { api } from '@/shared/lib/api';
import type { ChatImageUploadResponse, ChatMessageListResponse } from './dto';

// 텍스트 전송
export const getChatMessages = (
  chatRoomId: number,
  cursor?: { cursor: string; cursorId: number },
) => {
  return api.get<ChatMessageListResponse>(`/chats/${chatRoomId}/messages`, {
    params: { size: 30, ...(cursor && { cursor: cursor.cursor, cursorId: cursor.cursorId }) },
  });
};

// 채팅방 읽음 처리 → 내 unreadCount 0으로 (목록 안읽음 뱃지 제거용)
export const markChatRead = (chatRoomId: number) => {
  return api.post<void>(`/chats/${chatRoomId}/read`);
};

// 채팅 이미지 업로드 (multipart, 여러 장 한 번에) → 저장된 URL 리스트 반환
export const uploadChatImages = (chatRoomId: number, images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => formData.append('images', image));
  return api.post<ChatImageUploadResponse>(`/chats/${chatRoomId}/images`, formData, {
    headers: { 'Content-Type': undefined }, // 브라우저가 multipart/form-data + boundary 자동 설정
  });
};
// 채팅방 나가기
export const exitChatRoom = (chatRoomId: number) => {
  return api.post<void>(`/chats/${chatRoomId}/exit`);
};
