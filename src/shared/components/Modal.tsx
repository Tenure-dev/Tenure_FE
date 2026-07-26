import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: ModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        className={cn('bg-bg-white w-full max-w-[335px] rounded-2xl p-6', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
