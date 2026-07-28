import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useUserStore } from '@/store/userStore';

export const USER_ID_STORAGE_KEY = 'userId';
export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

const LOGIN_PATH = '/login';

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
  // FormData 요청은 기본 'application/json' 헤더를 지워야, axios가 FormData를 JSON으로
  // 직렬화하지 않고 브라우저가 boundary를 붙인 multipart/form-data로 전송한다.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
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
    // 백엔드가 인증 실패 시 403 반환 확인됨(2026-07-23). 401로 통일되면 이 분기 제거 검토.
    // TODO: 현재 401/403을 모두 인증 실패로 간주해 로그아웃 처리 중. 하지만 백엔드 스펙상
    // /trades/{id}/status, /ootds/{id}/tags 등 일부 API는 403을 '정상 로그인 상태의 권한 없음'으로도
    // 사용함(현재 미연동). 이 API들을 연동하는 시점에는 status 코드 대신 BaseResponse.code(예: USER_1004
    // 등 접두사)로 인증 실패 여부를 구분하도록 리팩터링 필요.
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      clearAuthStorage();
      // 이미 로그인 페이지라면 리다이렉트하지 않아 무한 루프를 방지한다.
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }
    const isAxios = axios.isAxiosError<BaseResponse<unknown>>(error);
    const responseBody = isAxios ? error.response?.data : undefined;
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
