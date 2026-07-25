import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export const USER_ID_STORAGE_KEY = 'userId';

interface BaseResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (userId) {
    config.headers.set('X-USER-ID', userId);
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
      return Promise.reject(new Error(body.message));
    }
    // 실제로는 언래핑된 data를 반환하지만, axios 타입과 맞추기 위해 AxiosResponse로 단언한다.
    return body.data as unknown as AxiosResponse;
  },
  (error) => {
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
