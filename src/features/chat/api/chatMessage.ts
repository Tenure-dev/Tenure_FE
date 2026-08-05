import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { ChatMessageResponse } from './dto';
import type { ChatMessage } from '../model/types';

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const ampm = d.getHours() < 12 ? '오전' : '오후';
  const hh = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  return `${ampm} ${hh}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const toChatMessage = (res: ChatMessageResponse): ChatMessage => {
  const myUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
  return {
    id: res.messageId,
    mine: String(res.senderId) === myUserId,
    text: res.content ?? undefined,
    images: res.contentImageUrls?.length
      ? res.contentImageUrls.map((url) => resolveFileUrl(url))
      : undefined,
    time: formatTime(res.createdAt),
  };
};
