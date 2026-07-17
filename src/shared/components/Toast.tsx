import type { ReactNode } from 'react';
import close from '@/shared/assets/close.svg';

export interface ToastProps {
  message: ReactNode;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => (
  <div className="bg-bg-black/90 flex w-fit max-w-full min-w-[295px] items-center justify-between gap-3 rounded-sm px-6 py-3">
    <span className="text-body-2 text-text-inverse font-normal">{message}</span>
    <button type="button" onClick={onClose} aria-label="닫기" className="shrink-0">
      <img src={close} width={16} height={16} alt="닫기" className="brightness-0 invert" />
    </button>
  </div>
);
export default Toast;
