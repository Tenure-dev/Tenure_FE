import { api } from '@/shared/lib/api';
import type { ChatImageUploadResponse, ChatMessageListResponse } from './dto';

// 텍스트 전송
export const getChatMessages = (chatRoomId: number) => {
  return api.get<ChatMessageListResponse>(`/chats/${chatRoomId}/messages`, {
    params: { size: 30 },
  });
};

// 채팅 이미지 업로드 (multipart) → 저장된 URL 반환
export const uploadChatImage = (chatRoomId: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  return api.post<ChatImageUploadResponse>(`/chats/${chatRoomId}/images`, formData, {
    headers: { 'Content-Type': undefined }, // 브라우저가 multipart/form-data + boundary 자동 설정
  });
};
