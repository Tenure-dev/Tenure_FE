import { useEffect, useRef, useState } from 'react';
import type { ChatMessageRequest, ChatMessageResponse } from './dto';
import type { Client } from '@stomp/stompjs';
import { createStompClient } from './socket';

export const useChatSocket = (chatRoomId: number) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const clientRef = useRef<Client | null>(null); // ref에 담아두면 effect 밖(전송 함수)에서도 접근

  useEffect(() => {
    const client = createStompClient((connected) => {
      connected.subscribe(`/sub/chats/${chatRoomId}`, (frame) => {
        const data = JSON.parse(frame.body);
        // /sub/chats/{id}로는 채팅 메시지 외에 읽음 이벤트({ type: 'READ' })도 오는데,
        // 이건 메시지가 아니므로(messageId 없음) 목록에 넣지 않는다. (빈 말풍선·중복 key 방지)
        // TODO: 읽음 "1" 표시 실제 연동 시 여기서 read 상태를 별도로 처리
        if (data?.type === 'READ') return;
        setMessages((prev) => [...prev, data as ChatMessageResponse]);
      });
    });

    clientRef.current = client;
    client.activate(); // 연결 시작

    // 방을 나가거나 방 id가 바뀌면 연결 정리
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [chatRoomId]);

  // 메시지 전송 (/pub/chats/{id}로 발행)
  const sendMessage = (body: ChatMessageRequest) => {
    const client = clientRef.current;
    // 아직 연결 전이면 전송하지 않음
    if (!client || !client.connected) return;
    client.publish({
      destination: `/pub/chats/${chatRoomId}`,
      body: JSON.stringify(body),
    });
  };

  return { messages, sendMessage };
};
