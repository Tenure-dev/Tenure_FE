import type { NotificationCategory, NotificationItem } from './types';

const PRODUCTS = [
  { brand: 'Levis', name: 'LVC 1955 501' },
  { brand: 'Guidi', name: '788 Boots' },
  { brand: 'Our Legacy', name: 'Mohair Knit' },
  { brand: 'Stüssy', name: 'Basic Logo Hoodie' },
  { brand: 'Nike', name: 'Air Jordan 1 Retro High' },
  { brand: 'New Balance', name: '993 Made in USA' },
];

const TEMPLATES: { category: NotificationCategory; message: string; urgent: boolean }[] = [
  { category: '아이템 소식', message: '가격이 128,000원으로 변경됐어요.', urgent: false },
  { category: '확인 필요', message: '구매 제안이 왔어요.', urgent: true },
  { category: '아이템 소식', message: '판매 중으로 전환됐어요.', urgent: false },
  { category: '거래 현황', message: '해당 제품이 판매 완료됐어요.', urgent: false },
  { category: '거래 현황', message: '배송이 시작됐어요.', urgent: false },
  { category: '관심', message: '회원님이 찜한 아이템에 관심이 몰리고 있어요.', urgent: false },
];

const TOTAL_MOCK_COUNT = 36;
const HOURS_BETWEEN_ITEMS = 3;

export const mockNotifications: NotificationItem[] = Array.from(
  { length: TOTAL_MOCK_COUNT },
  (_, index) => {
    const product = PRODUCTS[index % PRODUCTS.length];
    const template = TEMPLATES[index % TEMPLATES.length];

    return {
      id: `notification-${index}`,
      itemId: `item-${index}`,
      category: template.category,
      brand: product.brand,
      name: product.name,
      message: template.message,
      imageUrl: `https://picsum.photos/seed/notification-${index}/100/100`,
      createdAt: Date.now() - index * HOURS_BETWEEN_ITEMS * 60 * 60 * 1000,
      urgent: template.urgent,
    };
  },
);
