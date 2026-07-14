import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BottomSheet = ({ open, onClose, children }: BottomSheetProps) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-[opacity,visibility] duration-300',
        open ? 'visible opacity-100' : 'invisible opacity-0',
      )}
      onClick={onClose}
      inert={!open}
    >
      <div
        className={cn(
          'bg-bg-white w-full max-w-[768px] min-w-[320px] rounded-t-2xl pt-2 pb-7 transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-border-secondary mx-auto mb-2 h-1 w-10 rounded-full" />
        <div className="px-4 py-2">
          <div className="divide-border-secondary bg-gray-default divide-y overflow-hidden rounded-xl">
            {children}
            <button
              type="button"
              onClick={onClose}
              className="text-body-1 font-regular text-text-primary w-full py-3 text-center"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
