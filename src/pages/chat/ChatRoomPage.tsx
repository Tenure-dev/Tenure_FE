import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomHeader from './component/ChatRoomHeader';
import ChatProductBar from './component/ChatProductBar';
import ChatMessages from './component/ChatMessages';
import ChatInput from './component/ChatInput';
import ChatMoreSheet from './component/ChatMoreSheet';
import { Toast } from '@/shared/components';
import { useVisualViewportHeight } from '@/shared/hooks/useVisualViewport';
import { chatProduct, chatMessages, chatDate, partnerName, partnerAvatar } from './roomMock';
import type { ChatMessage, ChatRole, SaleStatus, TradeStatus } from '@/features/chat/model/types';

// 현재 시각을 '오전/오후 H:MM' 형식으로
const nowTime = () => {
  const d = new Date();
  const ampm = d.getHours() < 12 ? '오전' : '오후';
  const hh = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  return `${ampm} ${hh}:${d.getMinutes().toString().padStart(2, '0')}`;
};

// role: 'buyer' | 'seller' (내 입장)
// saleStatus: 'onSale' 판매중 / 'unlisted' 미판매
// tradeStatus: 거래 단계 'none' | 'waiting' | 'created' | 'done'
const ChatRoomPage = ({
  role = 'buyer',
  saleStatus = 'onSale',
  tradeStatus = 'none',
}: {
  role?: ChatRole;
  saleStatus?: SaleStatus;
  tradeStatus?: TradeStatus;
}) => {
  const navigate = useNavigate();
  const vvHeight = useVisualViewportHeight();
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [toast, setToast] = useState<ReactNode>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);

  // 이미지 첨부 → 내 이미지 메시지로 추가 (로컬)
  const handleSendImages = (files: FileList) => {
    const images = Array.from(files).map((file) => URL.createObjectURL(file));
    setMessages((prev) => [...prev, { id: Date.now(), mine: true, images, time: nowTime() }]);
  };

  const handleBlock = () => {
    setBlocked(true);
    setToast(
      <>
        <b className="font-semibold">{partnerName}</b> 님이 차단되었습니다
      </>,
    );
    setMenuOpen(false);
  };

  const handleUnblock = () => {
    setBlocked(false);
    setToast('차단 해제되었습니다.');
    setMenuOpen(false);
  };

  const handleLeave = () => {
    setMenuOpen(false);
    // 채팅 목록으로 이동하면서 "나갔습니다" 토스트 신호 전달
    navigate('/chat', { state: { leftChat: true } });
  };

  return (
    <div
      style={vvHeight ? { height: vvHeight } : undefined}
      className="bg-bg-white text-text-primary relative mx-auto flex h-dvh max-w-md flex-col overflow-hidden"
    >
      <ChatRoomHeader
        name={partnerName}
        onBack={() => navigate(-1)}
        onMenuClick={() => setMenuOpen(true)}
      />
      <ChatProductBar
        product={chatProduct}
        role={role}
        saleStatus={saleStatus}
        tradeStatus={tradeStatus}
      />
      <ChatMessages
        messages={messages}
        date={chatDate}
        avatar={partnerAvatar}
        name={partnerName}
        scrollTrigger={vvHeight}
      />
      <ChatInput onSendImages={handleSendImages} />

      {toast && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
          <Toast message={toast} onClose={() => setToast(null)} />
        </div>
      )}

      {menuOpen && (
        <ChatMoreSheet
          blocked={blocked}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onLeave={handleLeave}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatRoomPage;
