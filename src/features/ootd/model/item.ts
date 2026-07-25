export interface OotdItem {
  id: string;
  brand: string;
  name: string;
  thumbnail?: string;
  meta: string;
  isNew?: boolean;
}

export type WearTarget = '남성복' | '여성복' | '공용';
