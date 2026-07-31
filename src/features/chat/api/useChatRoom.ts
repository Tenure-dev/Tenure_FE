import { useQuery } from '@tanstack/react-query';
import { getChatRoom, toChatRoomView } from './room';

// 채팅방 상세 (프로덕트 바용). select로 바 값까지 변환해서 반환.
export const useChatRoom = (chatRoomId: number) =>
  useQuery({
    queryKey: ['chat-room', chatRoomId],
    queryFn: () => getChatRoom(chatRoomId),
    select: toChatRoomView,
    enabled: Number.isFinite(chatRoomId),
  });
