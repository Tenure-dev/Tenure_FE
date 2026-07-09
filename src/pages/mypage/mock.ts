export const profile = {
  name: '홍길동',
  grade: '레코드 사용자',
  height: 168,
  weight: 58,
  stats: { feed: 60, item: 16, wish: 4, follower: 201 },
};

// 회색 박스 높이를 다르게 줘서 실제 피드처럼 masonry 느낌
type FeedItem = { id: number; h: number };
const heights = [200, 150, 240, 170, 210, 160, 230, 180];
const make = (offset: number): FeedItem[] =>
  Array.from({ length: 8 }, (_, i) => ({ id: offset + i, h: heights[i % heights.length] }));

export const feedByMonth = [
  { month: '6월', items: make(0) },
  { month: '5월', items: make(100) },
];
