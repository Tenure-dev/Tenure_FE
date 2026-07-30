import { api } from '@/shared/lib/api';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { ChatProduct, ChatRole, SaleStatus, TradeStatus } from '../model/types';
import type { ChatRoomDetailResponse, ProductStatus } from './dto';

// 채팅방 상세 조회 (프로덕트 바 데이터)
export const getChatRoom = (chatRoomId: number) => {
  return api.get<ChatRoomDetailResponse>(`/chats/${chatRoomId}`);
};

const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  ON_SALE: '판매 중',
  TRADING: '거래 중',
  SOLD: '판매 완료',
  HIDDEN: '비공개',
};

// 프로덕트 바 렌더에 필요한 값 묶음
export interface ChatRoomView {
  product: ChatProduct;
  role: ChatRole;
  saleStatus: SaleStatus;
  tradeStatus: TradeStatus;
  offerEnabled: boolean;
  opponentName: string;
  opponentAvatar: string;
  productId: number;
  itemId: number;
  tradeId: number | null;
  opponentExited: boolean;
}

// 상세 응답 → 바 값으로 변환
export const toChatRoomView = (r: ChatRoomDetailResponse): ChatRoomView => {
  const isBuyer = r.buyer;
  const saleStatus: SaleStatus = r.productStatus === 'ON_SALE' ? 'onSale' : 'unlisted';

  const hasPending = saleStatus === 'onSale' ? r.hasPurchaseIntent : r.hasPurchaseOffer;

  const tradeStatus: TradeStatus =
    r.productStatus === 'SOLD'
      ? 'done'
      : r.productStatus === 'TRADING'
        ? 'created'
        : isBuyer && hasPending
          ? 'waiting'
          : 'none';

  return {
    product: {
      thumbnail: resolveFileUrl(r.itemImageUrl),
      brand: `${r.brandName} / ${r.itemName}`,
      price: r.price,
      status: PRODUCT_STATUS_LABEL[r.productStatus],
    },
    role: isBuyer ? 'buyer' : 'seller',
    saleStatus,
    tradeStatus,
    offerEnabled: !isBuyer && hasPending, // 판매자: 받은 요청/제안 있으면 확인 버튼 활성
    opponentName: r.opponentUsername,
    opponentAvatar: resolveFileUrl(r.opponentProfileImage),
    productId: r.productId,
    itemId: r.itemId,
    tradeId: r.tradeId,
    opponentExited: r.opponentExited,
  };
};
