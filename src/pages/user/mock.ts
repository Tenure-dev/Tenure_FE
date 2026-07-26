// 타인 프로필 UI용 목업 (백엔드 API 연동 전 임시).
// 로그인 사용자(useProfileStore)와 구분되는 "다른 사용자" 데이터다.
export const userProfile = {
  id: 2,
  name: 'Sujun',
  grade: '레코드 사용자',
  height: 168,
  weight: 58,
  following: false,
  stats: { feed: 60, item: 16, follower: 201 },
};

type FeedItem = { id: number; img: string };

const make = (offset: number): FeedItem[] =>
  Array.from({ length: 8 }, (_, i) => {
    const height = 300 + ((i * 70) % 350); // placeholder 높이를 다양하게
    return {
      id: offset + i,
      img: `https://picsum.photos/seed/${offset + i}/400/${height}`,
    };
  });

export const userFeedByMonth = [
  { month: '6월', items: make(0) },
  { month: '5월', items: make(100) },
];
