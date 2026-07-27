import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatListFilter from './component/ChatListFilter';
import ChatListHeader from './component/ChatListHeader';
import ChatListItem from './component/ChatListItem';
import { Toast } from '@/shared/components';
import type { ChatRoomFilterType } from '@/features/chat/api/dto';
import { useChatList } from '@/features/chat/api/useChatList';

// 필터 탭(한글) → 서버 type(영문)
const FILTER_TO_TYPE: Record<string, ChatRoomFilterType> = {
  전체: 'ALL',
  '구매 채팅': 'BUYING',
  '판매 채팅': 'SELLING',
  읽지않음: 'UNREAD',
};
const CHAT_FILTERS = Object.keys(FILTER_TO_TYPE);

const ChatListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leftChat = (location.state as { leftChat?: boolean } | null)?.leftChat ?? false;
  const [toast, setToast] = useState<string | null>(leftChat ? '채팅방을 나갔습니다.' : null);
  const [filter, setFilter] = useState('전체');

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatList(
    FILTER_TO_TYPE[filter],
  );

  // 여러 페이지를 하나의 목록으로 펼친다
  const rooms = data?.pages.flatMap((page) => page.rooms) ?? [];

  // leftChat 신호는 한 번만 쓰고 히스토리에서 비운다 (새로고침 시 토스트 재등장 방지)
  useEffect(() => {
    if (leftChat) window.history.replaceState({}, '');
  }, [leftChat]);

  // 바닥 감지 → 다음 페이지 로드
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="bg-bg-white text-text-primary relative flex min-h-screen flex-col">
      <ChatListHeader onBack={() => navigate(-1)} />
      <ChatListFilter filters={CHAT_FILTERS} active={filter} onChange={setFilter} />
      <div>
        {isPending && (
          <p className="text-body-3 text-text-secondary p-6 text-center">불러오는 중…</p>
        )}
        {isError && (
          <p className="text-body-3 text-text-secondary p-6 text-center">
            목록을 불러오지 못했어요.
          </p>
        )}
        {!isPending && !isError && rooms.length === 0 && (
          <p className="text-body-3 text-text-secondary p-6 text-center">채팅방이 없어요.</p>
        )}
        {rooms.map((room) => (
          <ChatListItem key={room.id} room={room} />
        ))}

        {/* 무한스크롤 바닥 감지 지점 */}
        <div ref={sentinelRef} className="h-1" />
        {isFetchingNextPage && (
          <p className="text-body-4 text-text-tertiary p-4 text-center">더 불러오는 중…</p>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ChatListPage;
