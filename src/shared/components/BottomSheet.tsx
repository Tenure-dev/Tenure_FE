import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  /**
   * 'menu': 아이템/더보기 메뉴처럼 children을 divide-y 메뉴 박스로 감싸고 하단에
   * "닫기" 버튼을 자동으로 붙인다 (기본값).
   * 'plain': children을 그대로 렌더링한다 (커스텀 콘텐츠, 폼, 리스트 등에 사용).
   */
  variant?: 'menu' | 'plain';
  showBackdrop?: boolean;
  showHandle?: boolean;
  className?: string;
  dragProgressPx?: number;
  /** 시트 자체를 접었다 펼쳤다 하는 높이(px)를 강제한다. 지정하지 않으면 콘텐츠/className 기준 높이를 사용한다. */
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
  // showBackdrop=false는 시트 뒤 콘텐츠(예: 사진 위 태그)를 계속 클릭 가능하게 둬야 하므로
  // 전체 화면을 덮는 바깥 래퍼는 backdrop이 있을 때만 클릭을 가로챈다.
  const blocksBackground = visible && showBackdrop;

  return (
    <div
      className={cn(
        'fixed inset-0 z-40',
        blocksBackground ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!visible}
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
