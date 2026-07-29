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

  // [디버그] 연결 시작 시점 정보
  console.log('[WS] 연결 시도:', WS_ENDPOINT, '| 토큰 있음?', !!accessToken);

  const client = new Client({
    webSocketFactory: () => {
      // [디버그] SockJS 생성 자체가 실패(예: 잘못된 URL)하면 여기서 잡힘
      try {
        return new SockJS(WS_ENDPOINT);
      } catch (e) {
        console.error('[WS] SockJS 생성 실패:', e);
        throw e;
      }
    },
    connectHeaders: { Authorization: `Bearer ${accessToken}` },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[WS] 연결 성공 ✅');
      onConnect(client);
    },
    onStompError: (frame) => {
      console.error('[WS] STOMP 에러:', frame.headers['message'], frame.body);
      onError?.(frame.headers['message'] ?? 'STOMP 에러');
    },
    onWebSocketError: (event) => {
      console.error('[WS] WebSocket 에러:', event);
    },
    onWebSocketClose: (event) => {
      console.warn('[WS] WebSocket 종료:', event?.code, event?.reason);
    },
  });

  return client;
};
