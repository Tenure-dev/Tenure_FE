import type { OotdItem } from './model/item';

// 분석 결과로 찾은 유사 아이템 개수 (목업)
export const SIMILAR_COUNT = 6;

// 기존 아이템 목업
export const existingItems: OotdItem[] = [
  {
    id: 'item-1',
    brand: 'Resolute',
    name: '710 Denim',
    thumbnail: 'https://picsum.photos/seed/ootd1/80/80',
    meta: '최근 착용 7일 전 · OOTD 인증 : 2회',
  },
  {
    id: 'item-2',
    brand: 'A.P.C.',
    name: 'Petit New Standard',
    thumbnail: 'https://picsum.photos/seed/ootd2/80/80',
    meta: '최근 착용 14일 전 · OOTD 인증 : 2회',
  },
  {
    id: 'item-3',
    brand: 'Levis',
    name: 'LVC 1955 501',
    thumbnail: 'https://picsum.photos/seed/ootd3/80/80',
    meta: '최근 착용 3일 전 · OOTD 인증 : 1회',
  },
  {
    id: 'item-4',
    brand: 'Levis',
    name: 'LVC 1955 501',
    thumbnail: 'https://picsum.photos/seed/ootd4/80/80',
    meta: '최근 착용 3일 전 · OOTD 인증 : 1회',
  },
  {
    id: 'item-5',
    brand: 'Nike',
    name: 'Air Max 90',
    thumbnail: 'https://picsum.photos/seed/ootd5/80/80',
    meta: '최근 착용 5일 전 · OOTD 인증 : 3회',
  },
  {
    id: 'item-6',
    brand: 'Stone Island',
    name: 'Garment Dyed Hoodie',
    thumbnail: 'https://picsum.photos/seed/ootd6/80/80',
    meta: '최근 착용 20일 전 · OOTD 인증 : 1회',
  },
];
