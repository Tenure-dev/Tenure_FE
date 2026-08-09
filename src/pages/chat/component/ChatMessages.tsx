import { Fragment, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/features/chat/model/types';
import MessageBubble from './MessageBubble';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// ISO → '2026.06.21 월요일'
const formatDateLabel = (iso: string): string => {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd} ${WEEKDAYS[d.getDay()]}요일`;
};

// 같은 날짜인지 판별 (연·월·일 기준)
const sameDay = (a: string, b: string): boolean =>
  new Date(a).toDateString() === new Date(b).toDateString();

type Props = {
  messages: ChatMessage[];
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
      {messages.map((message, i) => {
        // 그 날짜의 첫 메시지 위에 날짜 구분선 표시
        const showDate = i === 0 || !sameDay(message.createdAt, messages[i - 1].createdAt);
        return (
          <Fragment key={message.id}>
            {showDate && (
              <p className="text-regular text-body-2 text-text-tertiary py-1 text-center">
                {formatDateLabel(message.createdAt)}
              </p>
            )}
            <MessageBubble message={message} avatar={avatar} name={name} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default ChatMessages;
