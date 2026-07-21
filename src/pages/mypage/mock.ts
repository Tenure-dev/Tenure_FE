import type { RegisteredItem, RegisteredItemDetail } from '@/features/mypage/model/items';

export const profile = {
  name: '홍길동',
  grade: '레코드 사용자',
  height: 168,
  weight: 58,
  gender: 'male' as const,
  stats: { feed: 60, item: 16, wish: 4, follower: 201 },
};

// 이미지 원본 비율대로 높이 자동 조절 (가로는 칸 너비 고정)
type FeedItem = { id: number; img: string };

const make = (offset: number): FeedItem[] =>
  Array.from({ length: 8 }, (_, i) => {
    const height = 300 + ((i * 70) % 350); // placeholder 이미지 높이를 다양하게
    return {
      id: offset + i,
      img: `https://picsum.photos/seed/${offset + i}/400/${height}`,
    };
  });

export const feedByMonth = [
  { month: '6월', items: make(0) },
  { month: '5월', items: make(100) },
];

export const registeredItems: RegisteredItem[] = [
  {
    id: 'item-1',
    imageUrl: 'https://picsum.photos/seed/item1/200/200',
    brand: 'Levis',
    name: 'LVC 1955 501',
    forSale: false,
    lastWornDaysAgo: 1,
  },
  {
    id: 'item-2',
    imageUrl: 'https://picsum.photos/seed/item2/200/200',
    brand: 'Our Legacy',
    name: 'Mohair Knit',
    forSale: true,
    lastWornDaysAgo: 3,
  },
  {
    id: 'item-3',
    imageUrl: 'https://picsum.photos/seed/item3/200/200',
    brand: 'Vintage',
    name: '90s Leather Belt',
    forSale: true,
    lastWornDaysAgo: 5,
  },
  {
    id: 'item-4',
    imageUrl: 'https://picsum.photos/seed/item4/200/200',
    brand: 'Guidi',
    name: '788z Boots',
    forSale: false,
    lastWornDaysAgo: 4,
  },
  {
    id: 'item-5',
    imageUrl: 'https://picsum.photos/seed/item5/200/200',
    brand: 'Moscot',
    name: 'Lemtosh',
    forSale: true,
    lastWornDaysAgo: 6,
  },
];

export const registeredItemDetails: Record<string, RegisteredItemDetail> = {
  'item-1': {
    id: 'item-1',
    imageUrl: 'https://picsum.photos/seed/item1/200/200',
    brand: 'Levis',
    name: 'LVC 1955 501',
    forSale: false,
    category: '상의',
    subCategory: '긴소매 티셔츠',
    gender: '남성복',
    size: 'L',
    interestedCount: 14,
    lastWornDate: '26.05.26',
    acquiredDate: '26.05.26',
    frequentlyWornWith: ['Our Legacy knit', 'Guidi boots', 'Moscot'],
    history: [
      {
        userId: 'u1',
        username: '유진나라',
        profileImageUrl: 'https://picsum.photos/seed/u1/100/100',
        dateFrom: '26.07.10',
        dateTo: null,
        ootdCount: 12,
        isFirstOwner: false,
        ootdImages: [
          'https://picsum.photos/seed/o1/200/300',
          'https://picsum.photos/seed/o2/200/300',
          'https://picsum.photos/seed/o3/200/300',
        ],
      },
      {
        userId: 'u2',
        username: '소소한 행복',
        profileImageUrl: 'https://picsum.photos/seed/u2/100/100',
        dateFrom: '25.02.08',
        dateTo: '26.07.10',
        ootdCount: 8,
        isFirstOwner: true,
        ootdImages: [
          'https://picsum.photos/seed/o4/200/300',
          'https://picsum.photos/seed/o5/200/300',
          'https://picsum.photos/seed/o6/200/300',
        ],
      },
    ],
  },
  'item-2': {
    id: 'item-2',
    imageUrl: 'https://picsum.photos/seed/item2/200/200',
    brand: 'Our Legacy',
    name: 'Mohair Knit',
    forSale: true,
    category: '상의',
    subCategory: '니트/스웨터',
    gender: '남성복',
    size: 'M',
    interestedCount: 9,
    lastWornDate: '26.07.17',
    acquiredDate: '25.11.03',
    frequentlyWornWith: ['Levis 501', 'Guidi boots'],
    history: [
      {
        userId: 'u3',
        username: '패션리더',
        profileImageUrl: 'https://picsum.photos/seed/u3/100/100',
        dateFrom: '25.11.03',
        dateTo: null,
        ootdCount: 7,
        isFirstOwner: true,
        ootdImages: [
          'https://picsum.photos/seed/o7/200/300',
          'https://picsum.photos/seed/o8/200/300',
          'https://picsum.photos/seed/o9/200/300',
        ],
      },
    ],
  },
  'item-3': {
    id: 'item-3',
    imageUrl: 'https://picsum.photos/seed/item3/200/200',
    brand: 'Vintage',
    name: '90s Leather Belt',
    forSale: true,
    category: '액세서리',
    subCategory: '벨트',
    gender: '공용',
    size: 'Free',
    interestedCount: 3,
    lastWornDate: '26.07.15',
    acquiredDate: '26.03.10',
    frequentlyWornWith: ['Levis 501', 'Moscot Lemtosh'],
    history: [
      {
        userId: 'u4',
        username: '빈티지러버',
        profileImageUrl: 'https://picsum.photos/seed/u4/100/100',
        dateFrom: '26.03.10',
        dateTo: null,
        ootdCount: 5,
        isFirstOwner: true,
        ootdImages: [
          'https://picsum.photos/seed/o10/200/300',
          'https://picsum.photos/seed/o11/200/300',
          'https://picsum.photos/seed/o12/200/300',
        ],
      },
    ],
  },
  'item-4': {
    id: 'item-4',
    imageUrl: 'https://picsum.photos/seed/item4/200/200',
    brand: 'Guidi',
    name: '788z Boots',
    forSale: false,
    category: '신발',
    subCategory: '부츠',
    gender: '남성복',
    size: '43',
    interestedCount: 21,
    lastWornDate: '26.07.16',
    acquiredDate: '24.09.20',
    frequentlyWornWith: ['Our Legacy Knit', 'Levis 501'],
    history: [
      {
        userId: 'u5',
        username: '구이디팬',
        profileImageUrl: 'https://picsum.photos/seed/u5/100/100',
        dateFrom: '24.09.20',
        dateTo: null,
        ootdCount: 18,
        isFirstOwner: true,
        ootdImages: [
          'https://picsum.photos/seed/o13/200/300',
          'https://picsum.photos/seed/o14/200/300',
          'https://picsum.photos/seed/o15/200/300',
        ],
      },
    ],
  },
  'item-5': {
    id: 'item-5',
    imageUrl: 'https://picsum.photos/seed/item5/200/200',
    brand: 'Moscot',
    name: 'Lemtosh',
    forSale: true,
    category: '액세서리',
    subCategory: '안경',
    gender: '공용',
    size: '46',
    interestedCount: 6,
    lastWornDate: '26.07.14',
    acquiredDate: '25.06.01',
    frequentlyWornWith: ['Our Legacy Knit', 'Vintage Belt'],
    history: [
      {
        userId: 'u6',
        username: '안경수집가',
        profileImageUrl: 'https://picsum.photos/seed/u6/100/100',
        dateFrom: '25.06.01',
        dateTo: null,
        ootdCount: 10,
        isFirstOwner: true,
        ootdImages: [
          'https://picsum.photos/seed/o16/200/300',
          'https://picsum.photos/seed/o17/200/300',
          'https://picsum.photos/seed/o18/200/300',
        ],
      },
    ],
  },
};
