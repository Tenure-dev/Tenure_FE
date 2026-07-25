import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomHeader from './component/ChatRoomHeader';
import ChatProductBar from './component/ChatProductBar';
import ChatMessages from './component/ChatMessages';
import ChatInput from './component/ChatInput';
import ChatMoreSheet from './component/ChatMoreSheet';
import { Toast } from '@/shared/components';
import { useVisualViewportHeight } from '@/shared/hooks/useVisualViewport';
import profileDefault from '@/shared/assets/profileDefault.svg';
import type { ChatRole, SaleStatus, TradeStatus } from '@/features/chat/model/types';
import { useParams } from 'react-router-dom';
import { useChatSocket } from '@/features/chat/api/useChatSocket';
import { toChatMessage } from '@/features/chat/api/chatMessage';
import { useChatMessages } from '@/features/chat/api/useChatMessages';
import { uploadChatImage } from '@/features/chat/api/messages';
import { useMarkChatRead } from '@/features/chat/api/useMarkChatRead';
import { useChatRoom } from '@/features/chat/api/useChatRoom';

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
  const navigate = useNavigate();
  const vvHeight = useVisualViewportHeight();
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [toast, setToast] = useState<ReactNode>(null);
  const roomId = Number(id);
  const { messages: socketMessages, sendMessage } = useChatSocket(roomId);
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(roomId);
  const { mutate: markRead } = useMarkChatRead();
  const { data: room } = useChatRoom(roomId);

  // 방 진입 시 읽음 처리 (내 unreadCount 0 → 목록 뱃지 제거)
  useEffect(() => {
    if (Number.isFinite(roomId)) markRead(roomId);
  }, [roomId, markRead]);

  // 서버 값 우선, 아직 로딩 전이면 빈 값/기본 아바타
  const roleView = room?.role ?? role;
  const saleStatusView = room?.saleStatus ?? saleStatus;
  const tradeStatusView = room?.tradeStatus ?? tradeStatus;
  const partnerNameView = room?.opponentName ?? '';
  const partnerAvatarView = room?.opponentAvatar || profileDefault;

  const messages = useMemo(() => {
    // 각 page는 최신순. page 배열도 최신 페이지가 먼저.
    // → 페이지 순서 뒤집고, 페이지 안도 뒤집어서 전체 오래된→최신 순으로
    const past = history
      ? [...history.pages].reverse().flatMap((p) => [...p.chatMessages].reverse())
      : [];
    const merged = [...past, ...socketMessages];
    const seen = new Set<number>();
    return merged
      .filter((m) => {
        if (seen.has(m.messageId)) return false;
        seen.add(m.messageId);
        return true;
      })
      .map(toChatMessage);
  }, [history, socketMessages]);

  // 이미지 첨부
  const handleSendImages = async (files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        const { imageUrl } = await uploadChatImage(roomId, file);
        sendMessage({ messageType: 'IMAGE', imageUrl });
      } catch (e) {
        console.error('이미지 업로드 실패', e);
      }
    }
  };
  // 텍스트 전송 → 내 메시지로 추가 (로컬)
  const handleSendText = (text: string) => {
    sendMessage({ messageType: 'TEXT', content: text });
  };

  const handleBlock = () => {
    setBlocked(true);
    setToast(
      <>
        <b className="font-semibold">{partnerNameView}</b> 님이 차단되었습니다
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
        name={partnerNameView}
        onBack={() => navigate(-1)}
        onMenuClick={() => setMenuOpen(true)}
      />
      {room && (
        <ChatProductBar
          product={room.product}
          role={roleView}
          saleStatus={saleStatusView}
          tradeStatus={tradeStatusView}
          offerEnabled={offerEnabled}
          tradeId={room.tradeId}
        />
      )}
      <ChatMessages
        messages={messages}
        avatar={partnerAvatarView}
        name={partnerNameView}
        scrollTrigger={vvHeight}
        hasOlder={hasNextPage}
        isLoadingOlder={isFetchingNextPage}
        onLoadOlder={fetchNextPage}
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
