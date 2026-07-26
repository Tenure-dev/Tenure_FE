import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatList, type ChatListCursor } from './chatList';
import type { ChatRoomFilterType } from './dto';

export const useChatList = (type: ChatRoomFilterType = 'ALL') =>
  useInfiniteQuery({
    queryKey: ['chats', type],
    queryFn: ({ pageParam }) => getChatList(type, pageParam),
    // 첫 페이지는 커서 없음
    initialPageParam: undefined as ChatListCursor | undefined,
    // 이전 페이지의 nextCursor를 다음 요청의 pageParam으로 (null이면 더 없음 → 멈춤)
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  });
