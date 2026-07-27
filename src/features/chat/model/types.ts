export type ChatRoom = {
  id: number;
  name: string;
  message: string;
  product: string;
  date: string;
  unread: number;
  avatar: string;
};

// 채팅방 내 내 역할 (buyer: 구매자 / seller: 판매자)
export type ChatRole = 'buyer' | 'seller';

// 상품 판매 상태: onSale 판매중 / unlisted 미판매(제안 대상)
export type SaleStatus = 'onSale' | 'unlisted';

// 채팅방 거래 단계
// none: 요청/제안 전 / waiting: 응답 대기 중 / created: 거래 생성~완료 전 / done: 거래 완료 후
export type TradeStatus = 'none' | 'waiting' | 'created' | 'done';

export type ChatProduct = {
  thumbnail: string;
  brand: string;
  price: number;
  status: string; // '판매 중 · 최근 착용 1일 전' 등
};

export type ChatMessage = {
  id: number;
  mine: boolean; // true = 내 메시지(오른쪽)
  text?: string;
  images?: string[]; // 첨부 이미지
  time: string; // '오후 6:30'
  unread?: number; // 내 메시지 옆 안읽음 수
};
