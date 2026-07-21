import { useLocation, useNavigate } from 'react-router-dom';
import ChatListFilter from './component/ChatListFilter';
import ChatListHeader from './component/ChatListHeader';
import ChatListItem from './component/ChatListItem';
import { chatRooms } from './mock';
import { Toast } from '@/shared/components';
import { useEffect, useState } from 'react';

const ChatListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leftChat = (location.state as { leftChat?: boolean } | null)?.leftChat ?? false;
  const [toast, setToast] = useState<string | null>(leftChat ? '채팅방을 나갔습니다.' : null);
  const [filter, setFilter] = useState('전체');

  // leftChat 신호는 한 번만 쓰고 히스토리에서 비운다 (새로고침 시 토스트 재등장 방지)
  useEffect(() => {
    if (leftChat) window.history.replaceState({}, '');
  }, [leftChat]);

  const visibleRooms = chatRooms.filter((room) => {
    if (filter === '구매 채팅') return room.category === 'buy';
    if (filter === '판매 채팅') return room.category === 'sell';
    if (filter === '읽지않음') return room.unread > 0;
    return true;
  });
  return (
    <div className="bg-bg-white text-text-primary relative flex min-h-screen flex-col">
      <ChatListHeader onBack={() => navigate(-1)} />
      <ChatListFilter active={filter} onChange={setFilter} />
      <div>
        {visibleRooms.map((room) => (
          <ChatListItem key={room.id} room={room} />
        ))}
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ChatListPage;
