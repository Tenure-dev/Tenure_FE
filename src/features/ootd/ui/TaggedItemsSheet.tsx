import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { CTAButton } from '@/shared/components';
import { cn } from '@/shared/lib/cn';
import { useTagNavigation } from '@/features/ootd/lib/useTagNavigation';
import type { TaggedItem } from '@/features/ootd/model/types';

export interface TaggedItemsSheetProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  items: TaggedItem[];
  isOwner: boolean;
  onViewRelatedOotd: () => void;
  onToggleWish: (itemId: number, currentlyWished: boolean) => void;
}

const formatPrice = (price?: number) => (price ? `${price.toLocaleString()}원` : '');

const ACTION_WIDTH = 84;
const SWIPE_OPEN_THRESHOLD = ACTION_WIDTH / 2;

// 배경 화면 스크롤과 무관하게 화면 하단에 항상 고정 노출되는 높이(핸들 + 제목 + 부제목).
export const TAGGED_ITEMS_PEEK_HEIGHT_PX = 96;
// 펼친 상태에서 아래로 내려 접을 때는 조금만 내려도 반응하도록 낮게, 접힌 상태에서 위로
// 올려 펼 때는 실수로 스크롤하다 걸리지 않도록 조금 더 높게 잡는다.
const SHEET_CLOSE_THRESHOLD_PX = 40;
const SHEET_OPEN_THRESHOLD_PX = 80;
// 이 정도 이하로만 움직였으면 드래그가 아니라 탭으로 간주한다.
const SHEET_TAP_THRESHOLD_PX = 6;
const OPEN_HEIGHT_RATIO = 0.7;
const getOpenHeight = () => window.innerHeight * OPEN_HEIGHT_RATIO;

const STATUS_LABEL: Record<TaggedItem['status'], string> = {
  판매중: '판매중',
  미판매_제안가능: '미판매 · 구매제안 가능',
  미판매_제안불가: '미판매 · 구매제안 불가능',
  판매완료: '판매 완료',
  삭제됨: '삭제된 아이템',
};

interface TaggedItemRowProps {
  item: TaggedItem;
  isOwner: boolean;
  onToggleWish: (itemId: number, currentlyWished: boolean) => void;
}

const TaggedItemRow = ({ item, isOwner, onToggleWish }: TaggedItemRowProps) => {
  const { goToDetail, goToCheckout, goToOffer } = useTagNavigation();
  // 작성자 본인 글에서는 구매/구매제안/미판매 액션이 필요 없어 슬라이드 자체를 막는다.
  const hasAction = !isOwner && (item.status === '판매중' || item.status === '미판매_제안가능');
  const isDeleted = item.status === '삭제됨';
  const isSoldOut = item.status === '판매완료';
  const isDimmed = isDeleted || isSoldOut;
  const [swipePx, setSwipePx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; startSwipe: number } | null>(null);
  const draggedRef = useRef(false);

  const handlePurchaseAction = () => {
    if (item.status === '판매중') {
      goToCheckout(item.itemId);
    } else {
      goToOffer(item.itemId);
    }
  };

  const handleRowClick = () => {
    if (isDeleted || draggedRef.current) return;
    goToDetail(item, isOwner);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasAction) return;
    dragStartRef.current = { x: e.clientX, startSwipe: swipePx };
    draggedRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const draggedLeft = dragStartRef.current.x - e.clientX;
    if (Math.abs(draggedLeft) > 5) draggedRef.current = true;
    const next = Math.min(ACTION_WIDTH, Math.max(0, dragStartRef.current.startSwipe + draggedLeft));
    setSwipePx(next);
  };

  const handlePointerEnd = () => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    setIsDragging(false);
    setSwipePx((prev) => (prev > SWIPE_OPEN_THRESHOLD ? ACTION_WIDTH : 0));
  };

  return (
    <li className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1 overflow-hidden">
        {hasAction && (
          <div
            className="absolute inset-y-0 right-0 flex items-center"
            style={{ width: ACTION_WIDTH }}
          >
            <button
              type="button"
              onClick={handlePurchaseAction}
              className={cn(
                'text-btn-4 h-10 w-full rounded-md font-semibold',
                item.status === '판매중'
                  ? 'bg-brand text-white'
                  : 'border-border text-text-primary border',
              )}
            >
              {item.status === '판매중' ? '구매' : '구매제안'}
            </button>
          </div>
        )}

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClick={handleRowClick}
          onDragStart={(e) => e.preventDefault()}
          className={cn(
            'bg-bg-white flex touch-pan-y items-center gap-3 select-none',
            !isDeleted && 'cursor-pointer active:opacity-70',
            !isDragging && 'transition-transform duration-200 ease-out',
            isDimmed && 'opacity-50',
          )}
          style={{ transform: `translateX(-${swipePx}px)` }}
        >
          <div
            className={cn(
              'flex size-14 shrink-0 overflow-hidden rounded-md border-l-4',
              item.status === '판매중' ? 'border-brand' : 'border-gray-press',
            )}
          >
            <div className="bg-gray-bg size-full">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  draggable={false}
                  className="size-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 py-1">
            <p className="text-body-2 text-text-primary truncate font-semibold">
              {item.brand} / {item.name}
            </p>
            <p
              className={cn(
                'text-body-3',
                item.status === '판매중' ? 'text-brand' : 'text-text-primary',
              )}
            >
              {item.status === '판매중'
                ? `판매중 · ${formatPrice(item.price)}`
                : STATUS_LABEL[item.status]}
            </p>
          </div>
        </div>
      </div>

      {!isDeleted && !isOwner && (
        <button
          type="button"
          onClick={() => onToggleWish(item.itemId, item.wished)}
          aria-label={item.wished ? '관심 해제' : '관심 등록'}
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border',
            item.wished ? 'border-brand text-brand' : 'border-border-secondary text-text-tertiary',
          )}
        >
          {item.wished ? <BellRing size={16} /> : <Bell size={16} />}
        </button>
      )}
    </li>
  );
};

const TaggedItemsSheet = ({
  open,
  onOpen,
  onClose,
  items,
  isOwner,
  onViewRelatedOotd,
  onToggleWish,
}: TaggedItemsSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  // 드래그 중에만 값이 존재. wasOpen은 드래그 시작 시점의 open 상태(스냅 방향 판단용).
  const dragRef = useRef<{ startY: number; startH: number; wasOpen: boolean } | null>(null);
  const [height, setHeight] = useState(TAGGED_ITEMS_PEEK_HEIGHT_PX);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (dragRef.current) return;
    setHeight(open ? getOpenHeight() : TAGGED_ITEMS_PEEK_HEIGHT_PX);
  }, [open]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      startY: e.clientY,
      startH: sheetRef.current?.offsetHeight ?? height,
      wasOpen: open,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - e.clientY;
    const next = Math.min(
      Math.max(dragRef.current.startH + delta, TAGGED_ITEMS_PEEK_HEIGHT_PX),
      getOpenHeight(),
    );
    setHeight(next);
  };

  // 탭(거의 움직임 없음)과 드래그를 여기서 함께 판정한다. 별도 onClick을 쓰면, 드래그로
  // 방금 닫은 직후에도 브라우저가 뒤이어 click 이벤트를 한 번 더 보내는 경우가 있어(이동량과
  // 무관하게) open이 이미 false로 바뀐 걸 보고 handleHeaderClick이 즉시 다시 열어버리는
  // 문제가 있었다. 그래서 열기/닫기/탭을 전부 pointerup 하나로만 판단한다.
  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const { startH, wasOpen } = dragRef.current;
    const current = sheetRef.current?.offsetHeight ?? height;
    const movedDown = startH - current;
    const movedUp = current - startH;
    dragRef.current = null;
    setIsDragging(false);

    const isTap = Math.abs(movedUp) < SHEET_TAP_THRESHOLD_PX;
    if (wasOpen) {
      // 펼쳐진 상태에서 아래로 조금만 내려도 접는다(바깥 탭 닫기와 동일한 결과).
      if (movedDown > SHEET_CLOSE_THRESHOLD_PX) {
        onClose();
        setHeight(TAGGED_ITEMS_PEEK_HEIGHT_PX);
      } else {
        setHeight(getOpenHeight());
      }
    } else if (movedUp > SHEET_OPEN_THRESHOLD_PX || isTap) {
      // 접힌(peek) 상태에서 위로 충분히 올리거나, 핸들을 탭만 해도 펼친다.
      onOpen();
      setHeight(getOpenHeight());
    } else {
      setHeight(TAGGED_ITEMS_PEEK_HEIGHT_PX);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div
        className={cn(
          'absolute inset-0 bg-black/40',
          isDragging ? '' : 'transition-opacity duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className={cn(
          'bg-bg-white pointer-events-auto absolute inset-x-0 bottom-0 mx-auto flex max-w-[768px]',
          'min-w-[320px] flex-col overflow-hidden rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.12)]',
          isDragging ? '' : 'transition-[height] duration-300 ease-out',
        )}
        style={{ height }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDragStart={(e) => e.preventDefault()}
          className="flex shrink-0 touch-none flex-col items-center gap-2 px-5 pt-2 pb-4 select-none"
        >
          <span className="bg-gray-bg h-1 w-9 rounded-full" />
          <span className="w-full text-left">
            <span className="text-body-1 text-text-primary block font-semibold">태그된 아이템</span>
            <span className="text-body-3 text-text-tertiary">
              사진 속에서 태그된 것만 모아봅니다.
            </span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6" inert={!open}>
          {items.length === 0 ? (
            <div className="bg-bg-tertiary text-body-3 text-text-secondary rounded-lg px-4 py-8 text-center">
              관련된 태그가 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <TaggedItemRow
                  key={`${item.id}-${open}`}
                  item={item}
                  isOwner={isOwner}
                  onToggleWish={onToggleWish}
                />
              ))}
            </ul>
          )}

          <div className="mt-5">
            <CTAButton
              label="관련된 OOTD 보러가기"
              onClick={onViewRelatedOotd}
              fullWidth
              variant="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaggedItemsSheet;
