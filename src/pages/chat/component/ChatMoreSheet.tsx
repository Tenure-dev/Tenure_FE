import ban from '@/shared/assets/ban.svg';

type Props = {
  blocked: boolean;
  onBlock: () => void;
  onUnblock: () => void;
  onLeave: () => void;
  onClose: () => void;
};

const ChatMoreSheet = ({ blocked, onBlock, onUnblock, onLeave, onClose }: Props) => (
  <div
    className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-md flex-col justify-end bg-black/40"
    onClick={onClose}
  >
    <div
      className="animate-slide-up bg-bg-white rounded-t-2xl px-4 pt-2 pb-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-bg-300 mx-auto mb-4 h-1 w-10 rounded-full" />

      <div className="bg-bg-100 overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={blocked ? onUnblock : onBlock}
          className="text-body-1 flex w-full items-center gap-3 p-4"
        >
          <img src={ban} width={20} height={20} alt="차단" />
          {blocked ? '차단 해제' : '차단하기'}
        </button>

        <div className="bg-border-secondary h-px" />

        <button
          type="button"
          onClick={onLeave}
          className="text-body-1 text-error flex w-full items-center gap-3 p-4"
        >
          <svg width="22" height="22" viewBox="0 0  24" fill="none" className="text-error">
            <path
              d="M4 7h16M9 7V5h6v2M6 7l1 12h10l1-12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          채팅방 나가기
        </button>

        <div className="bg-border-secondary h-px" />

        <button
          type="button"
          onClick={onClose}
          className="text-body-1 font-regular w-full py-4 text-center"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
);

export default ChatMoreSheet;
