import image from '@/shared/assets/image.svg';

const ChatInput = () => (
  <div className="border-border-secondary flex items-center border-t px-4 py-3">
    <div className="bg-bg-100 flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
      {/* 이미지 첨부 (UI만) */}
      <button type="button" aria-label="이미지 첨부" className="shrink-0">
        <img src={image} width={24} height={24} alt="이미지 첨부" />
      </button>
      <input
        placeholder="메시지를 입력하세요."
        className="placeholder:text-text-tertiary flex-1 bg-transparent text-[16px] outline-none"
      />
    </div>
  </div>
);

export default ChatInput;
