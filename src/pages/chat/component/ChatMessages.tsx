import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/features/chat/model/types';
import MessageBubble from './MessageBubble';

type Props = {
  messages: ChatMessage[];
  date?: string;
  avatar: string;
  name: string;
  // 이 값이 바뀌면 맨 아래로 다시 스크롤 (키보드 열림 등)
  scrollTrigger?: number | null;
  hasOlder?: boolean;
  isLoadingOlder?: boolean;
  onLoadOlder?: () => void;
};

const ChatMessages = ({
  messages,
  date,
  avatar,
  name,
  scrollTrigger,
  hasOlder = false,
  isLoadingOlder = false,
  onLoadOlder,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // 과거 로드 직전 scrollHeight 저장. null이면 "맨 아래로" 모드
  const prevHeightRef = useRef<number | null>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // 맨 위 근처 + 더 있음 + 로딩중 아님 → 과거 불러오기
    if (el.scrollTop <= 40 && hasOlder && !isLoadingOlder) {
      prevHeightRef.current = el.scrollHeight; // 지금 높이 기억
      onLoadOlder?.();
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prevHeightRef.current !== null) {
      // 과거가 위에 붙음 → 늘어난 만큼만 내려서 보던 위치 유지
      el.scrollTop = el.scrollHeight - prevHeightRef.current;
      prevHeightRef.current = null;
    } else {
      // 새 메시지 or 최초 진입 → 맨 아래
      el.scrollTop = el.scrollHeight;
    }
  }, [scrollTrigger, messages.length]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="bg-bg-quaternary flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 pb-24"
    >
      {date && <p className="text-regular text-body-2 text-text-tertiary text-center">{date}</p>}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} avatar={avatar} name={name} />
      ))}
    </div>
  );
};

export default ChatMessages;
