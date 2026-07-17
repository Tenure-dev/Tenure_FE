import type { ChatMessage, ChatProduct } from '@/features/chat/model/types';

export const partnerName = 'GilDong';
export const partnerAvatar = 'https://picsum.photos/seed/gildong/100';
export const chatDate = '2026.06.21 월요일';

export const chatProduct: ChatProduct = {
  thumbnail: 'https://picsum.photos/seed/levis/200',
  brand: 'Levis / LVC 1955 501',
  price: 128000,
  status: '판매 중 · 최근 착용 1일 전',
};

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    mine: false,
    text: '저 혹시 이 제품 어디서 구매하셨는지 알려주실 수 있나요?',
    time: '오후 6:30',
  },
  { id: 2, mine: true, text: '네! 가능합니다!', time: '오후 6:30' },
  {
    id: 3,
    mine: true,
    text: '이번 제품은 성수에 있는 XXX 스탠딩 워크에서 구매한 제품입니다!',
    time: '오후 6:30',
    unread: 1,
  },
  {
    id: 4,
    mine: true,
    images: [
      'https://picsum.photos/seed/att1/200',
      'https://picsum.photos/seed/att2/200',
      'https://picsum.photos/seed/att3/200',
    ],
    time: '오후 6:30',
  },
];
