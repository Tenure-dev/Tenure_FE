import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  showBackdrop?: boolean;
  showHandle?: boolean;
  className?: string;
  /**
   * 드래그 중 실시간으로 끌어올린 픽셀 값. 값이 주어지면 open 기반 transition 대신
   * 이 값으로 위치를 직접 제어해 손가락을 따라오게 만든다 (드래그로 여는 동작용).
   */
  dragProgressPx?: number;
}

const BottomSheet = ({
  open,
  onClose,
  children,
  showBackdrop = true,
  showHandle = true,
  className,
  dragProgressPx,
}: BottomSheetProps) => {
  const isDragging = dragProgressPx !== undefined;
  const visible = open || isDragging;

  return (
    <div
      className={cn('fixed inset-0 z-40', visible ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!visible}
    >
      {showBackdrop && (
        <div
          className={cn(
            'absolute inset-0 bg-black/40',
            isDragging ? '' : 'transition-opacity duration-300',
            isDragging ? '' : open ? 'opacity-100' : 'opacity-0',
          )}
          style={isDragging ? { opacity: Math.min(dragProgressPx / 200, 1) } : undefined}
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'bg-bg-white absolute inset-x-0 bottom-0 mx-auto max-w-[768px] rounded-t-2xl',
          isDragging ? '' : 'transition-transform duration-300 ease-out',
          isDragging ? '' : open ? 'translate-y-0' : 'translate-y-full',
          className,
        )}
        style={
          isDragging
            ? { transform: `translateY(calc(100% - min(${dragProgressPx}px, 100%)))` }
            : undefined
        }
      >
        {showHandle && (
          <div className="flex justify-center pt-2 pb-1">
            <span className="bg-gray-bg h-1 w-9 rounded-full" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
