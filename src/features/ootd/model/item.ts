// OOTD 태그용 아이템
export interface OotdItem {
  id: string;
  brand: string; // 'Resolute'
  name: string; // '710 Denim'
  thumbnail?: string; // 아바타 이미지 (신규 아이템은 없을 수 있음)
  meta: string; // '최근 착용 7일 전 · OOTD 인증 : 2회' / '신규 아이템'
  isNew?: boolean; // 새로 등록한 아이템
}

// 새 아이템 등록 폼 값
export type WearTarget = '남성복' | '여성복' | '공용';
