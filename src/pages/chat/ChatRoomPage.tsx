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
import { uploadChatImages } from '@/features/chat/api/messages';
import { useMarkChatRead } from '@/features/chat/api/useMarkChatRead';
import { useChatRoom } from '@/features/chat/api/useChatRoom';
import { useExitChatRoom } from '@/features/chat/api/useExitChatRoom';

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
  const { mutate: exitRoom } = useExitChatRoom();
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
    try {
      // 여러 장을 한 번에 업로드하고, 받은 URL들을 하나의 메시지로 전송(묶음 표시)
      const { imageUrls } = await uploadChatImages(roomId, Array.from(files));
      sendMessage({ messageType: 'IMAGE', imageUrls });
    } catch {
      // 업로드 실패 시 조용히 무시 (TODO: 사용자 피드백 토스트 연동)
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
    exitRoom(roomId, {
      onSuccess: () => navigate('/chat', { state: { leftChat: true } }),
      onError: () => {
        // TODO: 실패 시 토스트 등 피드백
      },
    });
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
          offerEnabled={room.offerEnabled}
          tradeId={room.tradeId}
          itemId={room.itemId} // 아이템 상세·관리·구매 이동용
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
      <ChatInput
        onSendImages={handleSendImages}
        onSendText={handleSendText}
        disabled={room?.opponentExited}
      />

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
