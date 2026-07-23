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
    const body = response.data as BaseResponse<unknown>;
    if (!body.success) {
      return Promise.reject(new Error(body.message));
    }
    // 실제로는 언래핑된 data를 반환하지만, axios 타입과 맞추기 위해 AxiosResponse로 단언한다.
    return body.data as unknown as AxiosResponse;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthStorage();
      // 이미 로그인 페이지라면 리다이렉트하지 않아 무한 루프를 방지한다.
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }
    const message =
      (axios.isAxiosError<BaseResponse<unknown>>(error) && error.response?.data?.message) ||
      error.message;
    return Promise.reject(new Error(message));
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
