import { useMutation, useQueryClient } from '@tanstack/react-query';
import { exitChatRoom } from './messages';

export const useExitChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatRoomId: number) => exitChatRoom(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
