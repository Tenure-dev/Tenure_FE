import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markChatRead } from './messages';

// 채팅방 읽음 처리 훅. 성공 시 채팅 목록 캐시를 무효화해 안읽음 뱃지를 갱신한다.
export const useMarkChatRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatRoomId: number) => markChatRead(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
