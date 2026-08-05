import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/shared/lib/api';

// REST와 동일하게 VITE_API_BASE_URL 기준.
// 로컬은 /api-proxy(프록시), 배포는 실제 서버 주소.
const WS_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/ws`;

/**
 * 설정만 된 STOMP Client를 생성해 반환한다. (연결 시작 activate()는 호출부에서)
 * @param onConnect 연결 완료 후 실행 (여기서 구독)
 * @param onError   STOMP 에러 시 실행
 */

export const createStompClient = (
  onConnect: (client: Client) => void,
  onError?: (message: string) => void,
) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  const client = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    connectHeaders: { Authorization: `Bearer ${accessToken}` },
    reconnectDelay: 5000,
    onConnect: () => onConnect(client),
    onStompError: (frame) => onError?.(frame.headers['message'] ?? 'STOMP 에러'),
  });

  return client;
};
