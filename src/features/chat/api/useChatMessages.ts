import { useQuery } from '@tanstack/react-query';
import { getChatMessages } from './messages';

export const useChatMessages = (chatRoomId: number) => {
  return useQuery({
    queryKey: ['chat-messages', chatRoomId],
    queryFn: () => getChatMessages(chatRoomId),
    enabled: Number.isFinite(chatRoomId),
  });
};
