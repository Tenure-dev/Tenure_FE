import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import image from '@/shared/assets/image.svg';
import up from '@/shared/assets/up.svg';

type Props = {
  onSendImages?: (files: FileList) => void;
  onSendText?: (text: string) => void;
};

const ChatInput = ({ onSendImages, onSendText }: Props) => {
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

  return (
    <div className="border-border-secondary flex items-center border-t px-4 py-3">
      <div className="bg-bg-100 flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
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
