export interface CategoryGroup {
  name: string;
  items: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: '아우터',
    items: [
      '블루종',
      '레더 자켓',
      '데님 자켓',
      '윈드브레이커',
      '트랙 자켓',
      '코트',
      '후드 집업',
      '블레이저',
      '플리스',
      '트렌치코트',
      '패딩/다운',
      '무스탕/퍼',
      '워크/초어 재킷',
      '커버올',
    ],
  },
  {
    name: '상의',
    items: [
      '반팔 티셔츠',
      '긴팔 티셔츠',
      '민소매',
      '셔츠',
      '블라우스',
      '폴로',
      '스웨트셔츠',
      '후디',
      '니트',
      '가디건',
      '저지/유니폼',
      '스포츠 탑',
    ],
  },
  {
    name: '하의',
    items: [
      '코튼 팬츠',
      '데님 팬츠',
      '슬랙스',
      '치노 팬츠',
      '카고 팬츠',
      '트라우저',
      '스웨트 팬츠',
      '트랙 팬츠',
      '레깅스',
      '쇼츠',
      '오버올',
    ],
  },
  {
    name: '신발',
    items: [
      '스니커즈',
      '러닝화',
      '로퍼',
      '더비/옥스포드',
      '부츠',
      '워커',
      '샌들/슬리퍼',
      '힐/펌프스',
    ],
  },
  {
    name: '가방',
    items: [
      '백팩',
      '숄더백',
      '크로스백',
      '토트백',
      '핸드백',
      '클러치',
      '메신저백',
      '더플/보스턴백',
      '웨이스트/슬링백',
      '에코백',
    ],
  },
  {
    name: '모자',
    items: [
      '볼캡',
      '비니',
      '버킷햇',
      '베레모',
      '헌팅캡',
      '페도라',
      '트루퍼햇',
      '더플/바라클라바',
      '바이저',
    ],
  },
  {
    name: '치마',
    items: [
      '미니 스커트',
      '미디 스커트',
      'A라인',
      '롱 스커트',
      '데님 스커트',
      '플리츠 스커트',
      '펜슬/H라인',
      '플레어',
      '랩 스커트',
      '카고 스커트',
      '스커트팬츠',
    ],
  },
  {
    name: '원피스',
    items: [
      '미니 원피스',
      '미디 원피스',
      '맥시 원피스',
      '셔츠 원피스',
      '니트 원피스',
      '슬립 원피스',
      '점프수트',
      '오버롤 원피스',
      '롬퍼',
    ],
  },
  {
    name: '액세서리',
    items: [
      '벨트',
      '스카프/머플러',
      '넥타이',
      '장갑',
      '양말',
      '안경/선글라스',
      '키링',
      '헤어 액세서리',
      '지갑/카드홀더',
    ],
  },
  {
    name: '쥬얼리',
    items: ['목걸이', '반지', '팔찌', '귀걸이', '이어커프', '브로치', '발찌', '팬던트', '체인'],
  },
];

export type SizeOption = { system: string; value: string };

const INT_SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((v) => ({
  system: 'INT',
  value: v,
}));
const KR_CLOTHING_SIZES: SizeOption[] = ['85', '90', '95', '100', '105', '110', '115'].map((v) => ({
  system: 'KR',
  value: v,
}));
const EU_SIZES: SizeOption[] = ['36', '38', '40', '42', '44', '46', '48', '50'].map((v) => ({
  system: 'EU',
  value: v,
}));
const US_CLOTHING_SIZES: SizeOption[] = ['0', '1', '2', '3', '4', '5', '6'].map((v) => ({
  system: 'US',
  value: v,
}));
const INCH_SIZES: SizeOption[] = [
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
].map((v) => ({ system: 'INCH', value: v }));
const KR_SHOE_SIZES: SizeOption[] = [
  '210',
  '215',
  '220',
  '225',
  '230',
  '240',
  '245',
  '250',
  '255',
  '260',
  '265',
  '270',
  '275',
  '280',
  '285',
  '290',
  '295',
  '300',
  '305',
  '310',
].map((v) => ({ system: 'KR', value: v }));
const FREE_SIZES: SizeOption[] = [{ system: 'FREE', value: 'One size' }];

export const CATEGORY_SIZES: Record<string, SizeOption[]> = {
  상의: [...INT_SIZES, ...KR_CLOTHING_SIZES, ...EU_SIZES, ...US_CLOTHING_SIZES],
  원피스: [...INT_SIZES, ...KR_CLOTHING_SIZES, ...EU_SIZES, ...US_CLOTHING_SIZES],
  치마: [...INT_SIZES, ...INCH_SIZES, ...US_CLOTHING_SIZES],
  모자: FREE_SIZES,
  가방: FREE_SIZES,
  아우터: [...INT_SIZES, ...KR_CLOTHING_SIZES, ...EU_SIZES, ...US_CLOTHING_SIZES],
  하의: [...INT_SIZES, ...INCH_SIZES, ...US_CLOTHING_SIZES],
  신발: KR_SHOE_SIZES,
  액세서리: FREE_SIZES,
  쥬얼리: FREE_SIZES,
};

export const getSizeSystem = (categoryLarge: string, sizeValue: string): string =>
  CATEGORY_SIZES[categoryLarge]?.find((o) => o.value === sizeValue)?.system ?? '';
