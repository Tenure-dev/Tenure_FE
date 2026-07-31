import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatMessages } from './messages';

export const useChatMessages = (chatRoomId: number) => {
  return useInfiniteQuery({
    queryKey: ['chat-messages', chatRoomId],
    queryFn: ({ pageParam }) => getChatMessages(chatRoomId, pageParam),
    initialPageParam: undefined as { cursor: string; cursorId: number } | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor && lastPage.nextCursorId
        ? { cursor: lastPage.nextCursor, cursorId: lastPage.nextCursorId }
        : undefined,
    enabled: Number.isFinite(chatRoomId),
  });
};
