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
        const message: ChatMessageResponse = JSON.parse(frame.body);
        setMessages((prev) => [...prev, message]);
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
    if (!client || !client.connected) {
      console.warn('아직 연결되지 않았습니다.');
      return;
    }
    client.publish({
      destination: `/pub/chats/${chatRoomId}`,
      body: JSON.stringify(body),
    });
  };

  return { messages, sendMessage };
};
