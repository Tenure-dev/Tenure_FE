/** 서버 공통 응답 래퍼 */
export interface BaseResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

/** 페이지네이션 응답 (page는 0부터 시작) */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
