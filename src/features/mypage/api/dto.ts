/** 사용자 등급 */
export type UserGrade = 'BASIC' | 'RECORD';

/** 등급 표시 문구 */
export const USER_GRADE_LABEL: Record<UserGrade, string> = {
  BASIC: '기본 사용자',
  RECORD: '레코드 사용자',
};

/** GET /my-page 응답 */
export interface MyPageResponse {
  userId: number;
  profileImageUrl: string | null;
  username: string;
  grade: UserGrade;
  heightCm: number | null;
  weightKg: number | null;
  feedCount: number;
  itemCount: number;
  wishCount: number;
  followerCount: number;
}
