import type { ChatRoom } from '@/features/chat/model/types';

export const chatListFilters = ['전체', '구매 채팅', '판매 채팅', '읽지않음'];

export const chatRooms: ChatRoom[] = [
  {
    id: 1,
    name: 'GilDong',
    message: '저 혹시 이 제품 어디서 구매하셨는지 알...',
    product: 'Levis / LVC 19...',
    date: '6월 21일',
    unread: 1,
    avatar: 'https://picsum.photos/seed/gildong/100',
  },
  {
    id: 2,
    name: 'YuJin',
    message: '저기..압구정 로데오 무신사에서 구매하...',
    product: 'Guidi / 788 Bo...',
    date: '6월 23일',
    unread: 3,
    avatar: 'https://picsum.photos/seed/yujin/100',
  },
  {
    id: 3,
    name: 'SSUCC',
    message: '미판매로 올려주신 ***제품에 대해서...',
    product: 'Our Legacy /...',
    date: '6월 25일',
    unread: 0,
    avatar: 'https://picsum.photos/seed/ssucc/100',
  },
  {
    id: 4,
    name: 'KKKAS',
    message: '전송됨',
    product: 'Nike / Air Jord...',
    date: '6월 19일',
    unread: 0,
    avatar: 'https://picsum.photos/seed/kkkas/100',
  },
];
