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

export type OotdTagStatus = 'ANALYZING' | 'AUTO_UNCONFIRMED' | 'CONFIRMED';
export type OotdPublicationStatus = 'ACTIVE' | 'ARCHIVED';

/** GET /ootds/me 항목 (게시물 탭) */
export interface MyPostItem {
  ootdId: number;
  imageUrl: string;
  tagStatus: OotdTagStatus;
  publicationStatus: OotdPublicationStatus;
  archived: boolean; // true면 갤러리에서 흐리게 표시
  reviewRequired: boolean | null;
  reviewDeadlineAt: string | null;
  archivedAt: string | null;
  heartCount: number;
  saveCount: number;
  hearted: boolean; // 내가 하트 눌렀는지
  saved: boolean; // 내가 저장했는지
  createdAt: string;
}

/** GET /ootds/me 응답 (커서 페이지네이션) */
export interface MyPostsResponse {
  content: MyPostItem[];
  nextCursorCreatedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}

/** GET /ootds/hearted · /ootds/saved 항목 (좋아요·저장 탭) */
export interface ReactedItem {
  ootdId: number;
  imageUrl: string;
}

/** GET /ootds/hearted · /ootds/saved 응답 (커서 페이지네이션) */
export interface ReactedListResponse {
  content: ReactedItem[];
  nextCursorCreatedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
}
