import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface ToastProps {
  message: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Toast = ({ message, onClose, className }: ToastProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-24 z-50 mx-auto flex w-fit max-w-[90%] items-center gap-3 rounded-sm bg-black/80 px-4 py-3',
        className,
      )}
    >
      <span className="text-body-2 text-white">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="inline-flex shrink-0 items-center justify-center text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
