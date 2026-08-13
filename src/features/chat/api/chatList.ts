import { api } from '@/shared/lib/api';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { parseServerDate } from '@/shared/lib/parseServerDate';
import type { ChatRoomFilterType, ChatRoomListResponse, ChatRoomSummary } from './dto';
import type { ChatRoom } from '../model/types';

// 메시지 없는 방은 lastMessageAt이 null → 날짜 미표시(빈 문자열). 값 있으면 타임존 보정 후 표기.
const formatChatDate = (iso: string | null | undefined): string => {
  if (!iso) return '';
  const d = parseServerDate(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const toChatRoom = (s: ChatRoomSummary): ChatRoom => ({
  id: s.chatRoomId,
  name: s.opponentUsername,
  avatar: resolveFileUrl(s.opponentProfileImgUrl),
  product: `${s.brandName} / ${s.itemName}`,
  message: s.lastMessage ?? '',
  date: formatChatDate(s.lastMessageAt),
  unread: s.unreadCount,
});

/** 다음 페이지를 가리키는 커서 (첫 페이지는 커서 없음) */
export type ChatListCursor = { lastMessageAt: string; id: number };

/** 한 페이지 결과 (변환된 목록 + 다음 커서) */
export interface ChatListPageResult {
  rooms: ChatRoom[];
  nextCursor: ChatListCursor | null;
}

export const getChatList = async (
  type: ChatRoomFilterType,
  cursor?: ChatListCursor,
): Promise<ChatListPageResult> => {
  const data = await api.get<ChatRoomListResponse>('/chats', {
    params: {
      type,
      size: 20,
      // 첫 페이지는 커서를 안 보낸다
      ...(cursor && { cursor: cursor.lastMessageAt, cursorId: cursor.id }),
    },
  });

  return {
    rooms: data.content.map(toChatRoom),
    nextCursor:
      data.hasNext && data.nextCursorLastMessageAt != null && data.nextCursorId != null
        ? { lastMessageAt: data.nextCursorLastMessageAt, id: data.nextCursorId }
        : null,
  };
};
