import { api } from '@/shared/lib/api';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { ChatProduct, ChatRole, SaleStatus, TradeStatus } from '../model/types';
import type { ChatRoomDetailResponse, ProductStatus } from './dto';

// 채팅방 생성 또는 조회 (아이템 상세 페이지 채팅하기 버튼).
// 판매자가 받은 구매 제안 상세에서 열 땐 purchaseOfferId를 함께 보내 제안자↔소유자 방을 잡는다.
export const createOrGetChatRoom = (itemId: number, purchaseOfferId?: number) =>
  api.post<{ chatRoomId: number }>('/chats', {
    itemId,
    ...(purchaseOfferId != null && { purchaseOfferId }),
  });

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
  opponentName: string;
  opponentAvatar: string;
  productId: number | null;
  itemId: number;
  tradeId: number | null;
  purchaseIntentId: number | null;
  purchaseOfferId: number | null;
}

// 상세 응답 → 바 값으로 변환
export const toChatRoomView = (r: ChatRoomDetailResponse): ChatRoomView => ({
  product: {
    thumbnail: resolveFileUrl(r.itemImageUrl),
    brand: `${r.brandName} / ${r.itemName}`,
    price: r.price,
    status: r.productStatus ? PRODUCT_STATUS_LABEL[r.productStatus] : '',
  },
  role: r.buyer ? 'buyer' : 'seller',
  saleStatus: r.productStatus === 'ON_SALE' ? 'onSale' : 'unlisted',
  tradeStatus:
    r.productStatus === 'SOLD' ? 'done' : r.productStatus === 'TRADING' ? 'created' : 'none',
  opponentName: r.opponentUsername,
  opponentAvatar: resolveFileUrl(r.opponentProfileImage),
  productId: r.productId,
  itemId: r.itemId,
  tradeId: r.tradeId,
  purchaseIntentId: r.purchaseIntentId,
  purchaseOfferId: r.purchaseOfferId,
});
