export type OotdPickerItem = { id: number; imageUrl: string };

export const ootdPickerItems: OotdPickerItem[] = [
  { id: 900413, imageUrl: '/files/items/3dcfe762-55b3-438d-8eb8-dd4189cc5e59.jpg' },
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
