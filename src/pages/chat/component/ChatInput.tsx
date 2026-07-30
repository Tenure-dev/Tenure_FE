import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import image from '@/shared/assets/image.svg';
import up from '@/shared/assets/up.svg';

type Props = {
  onSendImages?: (files: FileList) => void;
  onSendText?: (text: string) => void;
  disabled?: boolean; // 상대방이 나간 방 등 → 입력 비활성화
};

const ChatInput = ({ onSendImages, onSendText, disabled = false }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onSendImages?.(files);
    e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화
  };

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    onSendText?.(value);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 무시
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // 상대방이 나간 방: 입력창 대신 안내 문구 표시
  if (disabled) {
    return (
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center px-4 py-6">
        <p className="text-body-3 text-text-tertiary">상대방이 채팅방을 나갔습니다.</p>
      </div>
    );
  }

  return (
    // 하단에 떠 있는 오버레이. 주변은 투명(pointer-events 통과), 입력 pill만 상호작용
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center px-4 py-3">
      <div className="border-border-secondary pointer-events-auto flex flex-1 items-center gap-2.5 self-stretch rounded-full border-[1.5px] bg-white px-3 py-4 shadow-lg">
        <button
          type="button"
          aria-label="이미지 첨부"
          className="shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <img src={image} width={24} height={24} alt="" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요."
          className="placeholder:text-text-tertiary flex-1 bg-transparent text-[16px] outline-none"
        />
        {text.trim() && (
          <button
            type="button"
            aria-label="전송"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSend}
            className="bg-brand-tertiary flex shrink-0 items-center justify-center rounded-full"
          >
            <img src={up} width={24} height={24} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
