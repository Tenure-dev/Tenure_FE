import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellRing } from 'lucide-react';
import { BottomSheet, CTAButton } from '@/shared/components';
import { cn } from '@/shared/lib/cn';
import { useTagNavigation } from '@/features/ootd/lib/useTagNavigation';
import type { TaggedItem } from '@/features/ootd/model/types';

export interface TaggedItemsSheetProps {
  open: boolean;
  onClose: () => void;
  items: TaggedItem[];
  isOwner: boolean;
  onViewRelatedOotd: () => void;
  onToggleWish: (itemId: number, currentlyWished: boolean) => void;
  dragProgressPx?: number;
}

const formatPrice = (price?: number) => (price ? `${price.toLocaleString()}원` : '');

const ACTION_WIDTH = 84;
const SWIPE_OPEN_THRESHOLD = ACTION_WIDTH / 2;

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
  const navigate = useNavigate();
  const { goToDetail, goToCheckout } = useTagNavigation();
  // 작성자 본인 글에서는 구매/구매제안/미판매 액션이 필요 없어 슬라이드 자체를 막는다.
  const hasAction = !isOwner && (item.status === '판매중' || item.status === '미판매_제안가능');
  const isDeleted = item.status === '삭제됨';
  const isDimmed = isDeleted || item.status === '판매완료';
  // 판매 전환 이력이 없는 미판매 아이템은 productId가 없어 이동할 상세 화면이 없으므로
  // 일반 클릭은 막고, 슬라이드로 드러나는 "구매제안" 버튼으로만 이동할 수 있게 한다.
  const isUnsold = item.status === '미판매_제안가능' || item.status === '미판매_제안불가';
  const [swipePx, setSwipePx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; startSwipe: number } | null>(null);
  const draggedRef = useRef(false);

  const handlePurchaseAction = () => {
    if (item.status === '판매중') {
      goToCheckout(item.itemId);
    } else {
      navigate(`/items/${item.itemId}`);
    }
  };

  const handleRowClick = () => {
    if (isDeleted || isUnsold || draggedRef.current) return;
    goToDetail(item);
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
          className={cn(
            'bg-bg-white flex touch-pan-y items-center gap-3',
            !isDeleted && !isUnsold && 'cursor-pointer active:opacity-70',
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
                <img src={item.imageUrl} alt="" className="size-full object-cover" />
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

      {!isDeleted && (
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
  onClose,
  items,
  isOwner,
  onViewRelatedOotd,
  onToggleWish,
  dragProgressPx,
}: TaggedItemsSheetProps) => {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      variant="plain"
      dragProgressPx={dragProgressPx}
      className="max-h-[70vh] overflow-y-auto"
    >
      <div className="px-5 pb-6">
        <h2 className="text-title-4 text-text-primary font-semibold">태그된 아이템</h2>
        <p className="text-body-3 text-text-tertiary mt-1">사진 속에서 태그된 것만 모아봅니다.</p>

        {items.length === 0 ? (
          <div className="bg-bg-tertiary text-body-3 text-text-secondary mt-5 rounded-lg px-4 py-8 text-center">
            관련된 태그가 없습니다.
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
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
    </BottomSheet>
  );
};

export default TaggedItemsSheet;
