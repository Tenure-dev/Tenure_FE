import axios from 'axios';
import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';

// 하트/저장 API는 204 No Content(본문 없음)를 반환한다.
// 공용 api 인터셉터는 빈 본문을 실패로 처리(onError 롤백 유발)하므로,
// 이 요청들만 별도 인스턴스로 보내 204를 정상 처리한다. (공용 파일 미수정)
const reactionClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 공용 api와 동일하게 X-USER-ID 헤더 부착
reactionClient.interceptors.request.use((config) => {
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (userId) config.headers.set('X-USER-ID', userId);
  return config;
});

export { reactionClient };
