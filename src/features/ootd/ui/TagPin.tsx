import { cn } from '@/shared/lib/cn';
import type { TaggedItem } from '@/features/ootd/model/types';

export interface TagPinProps {
  item: TaggedItem;
  selected?: boolean;
  onClick?: () => void;
  // false면 탭해도 사진 클릭(태그 전체 숨김)으로 번지지만 않게 이벤트만 막고,
  // 버튼 특유의 눌림/탭 하이라이트 같은 클릭 모션은 주지 않는다. (예: 이동할 곳이 없는 미판매 태그)
  interactive?: boolean;
}

const TagPin = ({ item, selected = false, onClick, interactive = true }: TagPinProps) => {
  const content = (
    <>
      <p className="text-body-3 text-text-primary truncate font-semibold">
        {item.brand} / {item.name}
      </p>
      <p
        className={cn(
          'text-body-4',
          item.status === '판매중' ? 'text-brand' : 'text-text-tertiary',
        )}
      >
        #{item.status}
      </p>
    </>
  );

  // 말풍선이 사진 밖으로 넘치지 않도록 태그 지점이 가장자리에 가까우면 반대쪽으로 펼친다.
  const flipX = item.position.x > 65;
  const flipY = item.position.y < 25;

  // 태그 지점과 맞닿는 모서리만 뾰족하게(각지게) 남기고 나머지 세 모서리는 둥글게 처리한다.
  const cornerClass =
    !flipY && !flipX
      ? 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
      : !flipY && flipX
        ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
        : flipY && !flipX
          ? 'rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
          : 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl';

  const style = {
    left: `${item.position.x}%`,
    top: `${item.position.y}%`,
    transform: `translate(${flipX ? '-100%' : '0%'}, ${flipY ? '0%' : '-100%'})`,
  };
  const className = cn(
    'absolute max-w-[170px] bg-bg-white/95 px-3 py-1.5 text-left shadow-md',
    cornerClass,
    selected && 'ring-2 ring-brand',
  );

  if (!onClick) {
    return (
      <div style={style} className={className}>
        {content}
      </div>
    );
  }

  if (!interactive) {
    return (
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={style}
        className={cn(className, 'cursor-default')}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={style}
      className={className}
    >
      {content}
    </button>
  );
};

export default TagPin;
