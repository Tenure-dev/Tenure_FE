import axios, { type AxiosError } from 'axios';
import type { BaseResponse } from './baseResponse';

// 서버 API 경로엔 /api prefix가 없다.
// 개발 중에는 vite dev server의 /api-proxy를 통해 8080으로 중계한다 (CORS 회피).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api-proxy';

// JWT 적용 전 임시 인증 헤더. JWT 붙으면 이 부분만 교체하면 된다.
let currentUserId = String(import.meta.env.VITE_USER_ID ?? '1');

export const setCurrentUserId = (id: string | number) => {
  currentUserId = String(id);
};

/** 서버가 내려준 code/message를 담는 에러 */
export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

// 요청: 임시 인증 헤더 부착
api.interceptors.request.use((config) => {
  config.headers.set('X-USER-ID', currentUserId);
  return config;
});

// 응답: BaseResponse 언랩 → response.data가 곧 data가 된다
api.interceptors.response.use(
  (response) => {
    const body = response.data as BaseResponse<unknown> | undefined;

    // 204 No Content 등 BaseResponse가 아닌 응답은 그대로 통과
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        return Promise.reject(new ApiError(body.message, body.code, response.status));
      }
      response.data = body.data;
    }

    return response;
  },
  (error: AxiosError<BaseResponse<unknown>>) => {
    const body = error.response?.data;
    const message = body?.message ?? error.message ?? '요청에 실패했습니다.';
    return Promise.reject(new ApiError(message, body?.code, error.response?.status));
  },
);

export default api;
