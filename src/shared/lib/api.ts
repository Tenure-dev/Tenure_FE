import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useUserStore } from '@/store/userStore';

export const USER_ID_STORAGE_KEY = 'userId';
export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

const LOGIN_PATH = '/login';
const AUTH_LOGOUT_CODES = ['SECURITY_1001', 'SECURITY_1002', 'AUTH_401'];

interface BaseResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_ID_STORAGE_KEY);
  useUserStore.getState().clearUser();
};

// BaseResponse.code(예: AUTH_1001)를 보존해 호출부가 실패 사유를 분기할 수 있게 한다.
export class ApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    // 하트/저장 토글 등 일부 엔드포인트는 204 No Content로 응답해 BaseResponse 포맷을 안 따른다.
    if (response.status === 204 || !response.data) {
      return undefined as unknown as AxiosResponse;
    }
    const body = response.data as BaseResponse<unknown>;

    if (!body.success) {
      return Promise.reject(new ApiError(body.message, body.code));
    }
    // 실제로는 언래핑된 data를 반환하지만, axios 타입과 맞추기 위해 AxiosResponse로 단언한다.
    return body.data as unknown as AxiosResponse;
  },
  (error) => {
    const isAxios = axios.isAxiosError<BaseResponse<unknown>>(error);
    const responseBody = isAxios ? error.response?.data : undefined;
    const code = responseBody?.code;

    // 인증 실패는 status(401/403)가 아니라 code 화이트리스트로 판단한다.
    // status만 보면 오판한다: AUTH_403은 이름과 달리 토큰과 무관한 일반 권한없음
    // (도메인별 403, 예: TRADE_403_FORBIDDEN_TRANSITION)이고, USER_1004(로그인 실패)는
    // 401이지만 자격 증명이 틀렸다는 뜻일 뿐 세션 만료가 아니다.
    if (code && AUTH_LOGOUT_CODES.includes(code)) {
      clearAuthStorage();
      // 이미 로그인 페이지라면 리다이렉트하지 않아 무한 루프를 방지한다.
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }
    const message = responseBody?.message || error.message;

    if (isAxios) {
      console.error(
        `[API Error] ${error.response?.status ?? 'NETWORK'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        message,
      );
    }

    return Promise.reject(new ApiError(message, responseBody?.code));
  },
);

// 인터셉터가 응답을 BaseResponse.data로 언래핑하므로 반환 타입을 Promise<T>로 재선언한다.
export const api = instance as unknown as {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
};
