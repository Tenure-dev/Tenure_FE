export type OotdPickerItem = { id: number; imageUrl: string };

export const ootdPickerItems: OotdPickerItem[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/ootdp1/400/600' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/ootdp2/400/450' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/ootdp3/400/700' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/ootdp4/400/500' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/ootdp5/400/550' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/ootdp6/400/480' },
  { id: 7, imageUrl: 'https://picsum.photos/seed/ootdp7/400/620' },
  { id: 8, imageUrl: 'https://picsum.photos/seed/ootdp8/400/520' },
];

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
