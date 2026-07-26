import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/features/chat/model/types';
import MessageBubble from './MessageBubble';

type Props = {
  messages: ChatMessage[];
  date: string;
  avatar: string;
  name: string;
  // 이 값이 바뀌면 맨 아래로 다시 스크롤 (키보드 열림 등)
  scrollTrigger?: number | null;
};

const ChatMessages = ({ messages, date, avatar, name, scrollTrigger }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight; // 항상 최신 메시지(맨 아래)로
  }, [scrollTrigger, messages.length]);

  return (
    <div
      ref={scrollRef}
      className="bg-bg-quaternary flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
    >
      <p className="text-regular text-body-2 text-text-tertiary text-center">{date}</p>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} avatar={avatar} name={name} />
      ))}
    </div>
  );
};

export default ChatMessages;
