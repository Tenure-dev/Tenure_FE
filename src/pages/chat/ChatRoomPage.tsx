import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomHeader from './component/ChatRoomHeader';
import ChatProductBar from './component/ChatProductBar';
import ChatMessages from './component/ChatMessages';
import ChatInput from './component/ChatInput';
import ChatMoreSheet from './component/ChatMoreSheet';
import { Toast } from '@/shared/components';
import { useVisualViewportHeight } from '@/shared/hooks/useVisualViewport';
import { chatProduct, chatDate, partnerName, partnerAvatar } from './roomMock';
import type { ChatRole, SaleStatus, TradeStatus } from '@/features/chat/model/types';
import { useParams } from 'react-router-dom';
import { useChatSocket } from '@/features/chat/api/useChatSocket';
import { toChatMessage } from '@/features/chat/api/chatMessage';

// role: 'buyer' | 'seller' (내 입장)
// saleStatus: 'onSale' 판매중 / 'unlisted' 미판매
// tradeStatus: 거래 단계 'none' | 'waiting' | 'created' | 'done'
const ChatRoomPage = ({
  role = 'buyer',
  saleStatus = 'onSale',
  tradeStatus = 'none',
  offerEnabled = true,
}: {
  role?: ChatRole;
  saleStatus?: SaleStatus;
  tradeStatus?: TradeStatus;
  offerEnabled?: boolean;
}) => {
  const { id } = useParams();

  // 연결 확인용 임시 로그 (확인 후 제거)

  const navigate = useNavigate();
  const vvHeight = useVisualViewportHeight();
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [toast, setToast] = useState<ReactNode>(null);
  const { messages: socketMessages, sendMessage } = useChatSocket(Number(id));
  const messages = socketMessages.map(toChatMessage);

  // 이미지 첨부 → 내 이미지 메시지로 추가 (로컬)
  const handleSendImages = (files: FileList) => {
    console.warn('이미지 전송은 아직 미구현', files);
  };

  // 텍스트 전송 → 내 메시지로 추가 (로컬)
  const handleSendText = (text: string) => {
    sendMessage({ messageType: 'TEXT', content: text });
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
        offerEnabled={offerEnabled}
      />
      <ChatMessages
        messages={messages}
        date={chatDate}
        avatar={partnerAvatar}
        name={partnerName}
        scrollTrigger={vvHeight}
      />
      <ChatInput onSendImages={handleSendImages} onSendText={handleSendText} />

      <Toast message={toast} onClose={() => setToast(null)} />

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
