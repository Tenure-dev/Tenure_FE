import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  variant?: 'menu' | 'plain';
  showBackdrop?: boolean;
  showHandle?: boolean;
  className?: string;
  dragProgressPx?: number;
  heightPx?: number;
  onHandlePointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onHandlePointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onHandlePointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onHandlePointerCancel?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

const BottomSheet = ({
  open,
  onClose,
  children,
  variant = 'menu',
  showBackdrop = true,
  showHandle = true,
  className,
  dragProgressPx,
  heightPx,
  onHandlePointerDown,
  onHandlePointerMove,
  onHandlePointerUp,
  onHandlePointerCancel,
}: BottomSheetProps) => {
  const isDragging = dragProgressPx !== undefined;
  const visible = open || isDragging;
  const blocksBackground = visible && showBackdrop;

  return (
    <div
      className={cn(
        'fixed inset-0 z-40',
        blocksBackground ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      inert={!visible}
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
          'bg-bg-white absolute inset-x-0 bottom-0 mx-auto max-w-[768px] min-w-[320px] rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.12)]',
          visible ? 'pointer-events-auto' : 'pointer-events-none',
          isDragging ? '' : 'transition-[transform,height] duration-300 ease-out',
          isDragging ? '' : open ? 'translate-y-0' : 'translate-y-full',
          className,
        )}
        style={{
          ...(isDragging
            ? { transform: `translateY(calc(100% - min(${dragProgressPx}px, 100%)))` }
            : undefined),
          ...(heightPx !== undefined ? { height: heightPx } : undefined),
        }}
      >
        {showHandle && (
          <div
            className={cn(
              'flex touch-none justify-center py-2',
              onHandlePointerDown && 'cursor-grab active:cursor-grabbing',
            )}
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerCancel}
          >
            <span className="bg-border-secondary h-1 w-10 rounded-full" />
          </div>
        )}
        {variant === 'menu' ? (
          <div className="px-4 pb-7">
            <div className="divide-border-secondary bg-gray-default divide-y overflow-hidden rounded-xl">
              {children}
              <button
                type="button"
                onClick={() => onClose?.()}
                className="text-body-1 font-regular text-text-primary w-full py-3 text-center"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
