import type { ItemDetail } from './types';

const SELLER = {
  id: 'seller-1',
  nickname: 'GilDong',
  followerCount: 10,
  avatarUrl: 'https://picsum.photos/seed/seller-1/100/100',
};
const ME_AS_SELLER = {
  id: 'me-1',
  nickname: '나',
  followerCount: 10,
  avatarUrl: 'https://picsum.photos/seed/me-1/100/100',
};

const TENURE_RECORD = {
  interestCount: 5,
  ootdVerifiedCount: 10,
  lastWornDate: '26.05.26',
  size: 'L',
  wornFor: '남성',
  category: '긴소매 티셔츠',
  firstOwnedDate: '26.04.20',
};

const MEASUREMENTS = [
  { label: '허리 단면', value: '39cm' },
  { label: '허벅지 단면', value: '30cm' },
  { label: '총 기장', value: '103cm' },
  { label: '밑위', value: '31cm' },
  { label: '인심', value: '73cm' },
  { label: '밑단', value: '21cm' },
];

const CONDITION_CHECKS = [
  { label: '오염 있음', checked: true },
  { label: '찢어짐 있음', checked: false },
  { label: '보풀/변색 있음', checked: false },
  { label: '수선 이력 있음', checked: true },
  { label: '구성품 누락 있음', checked: false },
];

const REPRESENTATIVE_OOTDS = ['ootd-1', 'ootd-2', 'ootd-3'].map((seed) => ({
  id: seed,
  imageUrl: `https://picsum.photos/seed/${seed}/300/300`,
}));

const BASE = {
  brand: 'Levis',
  name: 'LVC 1955 501',
  imageUrls: ['https://picsum.photos/seed/item-1/600/600'],
  tenureRecord: TENURE_RECORD,
  representativeOOTDs: REPRESENTATIVE_OOTDS,
};

const LISTING_FIELDS = {
  description:
    '핏은 전체적으로 여유 있는 편이라 편하게 착용하기 좋습니다.\n' +
    '착용감은 부드럽고 활동할 때 크게 불편함이 없습니다.\n' +
    '실제 색감은 사진과 거의 비슷하지만, 조명에 따라 조금 다르게 보일 수 있습니다. 생활 사용감은 있으나 눈에 띄는 큰 오염이나 손상은 없습니다.\n' +
    '구매 전 사이즈와 상태를 꼭 확인해 주세요.',
  measurementTitle: '실측 입력 · 바지',
  measurements: MEASUREMENTS,
  conditionChecks: CONDITION_CHECKS,
};

export const MOCK_ITEM_DETAILS: Record<string, ItemDetail> = {
  'buyer-on-sale': {
    ...BASE,
    id: 'buyer-on-sale',
    sellerId: SELLER.id,
    seller: SELLER,
    saleStatus: 'onSale',
    price: 128000,
    isWished: false,
    ...LISTING_FIELDS,
  },
  'buyer-unsold-active': {
    ...BASE,
    id: 'buyer-unsold-active',
    sellerId: SELLER.id,
    seller: SELLER,
    saleStatus: 'unsold',
    isWished: false,
    offerAvailable: true,
  },
  'buyer-unsold-inactive': {
    ...BASE,
    id: 'buyer-unsold-inactive',
    sellerId: SELLER.id,
    seller: SELLER,
    saleStatus: 'unsold',
    isWished: false,
    offerAvailable: false,
  },
  'buyer-sold-out': {
    ...BASE,
    id: 'buyer-sold-out',
    sellerId: SELLER.id,
    seller: SELLER,
    saleStatus: 'soldOut',
    isWished: false,
    ...LISTING_FIELDS,
  },
  'seller-on-sale': {
    ...BASE,
    id: 'seller-on-sale',
    sellerId: ME_AS_SELLER.id,
    seller: ME_AS_SELLER,
    saleStatus: 'onSale',
    price: 128000,
    isWished: false,
    ...LISTING_FIELDS,
  },
  'seller-unsold': {
    ...BASE,
    id: 'seller-unsold',
    sellerId: ME_AS_SELLER.id,
    seller: ME_AS_SELLER,
    saleStatus: 'unsold',
    isWished: false,
  },
  'seller-sold-out': {
    ...BASE,
    id: 'seller-sold-out',
    sellerId: ME_AS_SELLER.id,
    seller: ME_AS_SELLER,
    saleStatus: 'soldOut',
    isWished: false,
    ...LISTING_FIELDS,
  },
};
