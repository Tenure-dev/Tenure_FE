import type { TaggedItem } from '@/features/ootd/model/types';
import TagBubble, { type TagBubbleTail } from './TagBubble';

export interface TagPinProps {
  item: TaggedItem;
  selected?: boolean;
  onClick?: () => void;
  // false면 탭해도 사진 클릭(태그 전체 숨김)으로 번지지만 않게 이벤트만 막고,
  // 버튼 특유의 눌림/탭 하이라이트 같은 클릭 모션은 주지 않는다. (예: 이동할 곳이 없는 미판매 태그)
  interactive?: boolean;
}

const TagPin = ({ item, selected = false, onClick, interactive = true }: TagPinProps) => {
  // 말풍선이 사진 밖으로 넘치지 않도록 태그 지점이 가장자리에 가까우면 반대쪽으로 펼친다.
  const flipX = item.position.x > 65;
  const flipY = item.position.y < 25;

  // 태그 지점(anchor)과 맞닿는 모서리를 꼬리로. flip 조합 → 꼬리 위치.
  const tail: TagBubbleTail = !flipY ? (flipX ? 'br' : 'bl') : flipX ? 'tr' : 'tl';

  const style = {
    left: `${item.position.x}%`,
    top: `${item.position.y}%`,
    transform: `translate(${flipX ? '-100%' : '0%'}, ${flipY ? '0%' : '-100%'})`,
  };

  const bubble = (
    <TagBubble
      title={`${item.brand} / ${item.name}`}
      status={item.status}
      statusClassName={item.status === '판매중' ? 'text-brand' : 'text-text-tertiary'}
      tail={tail}
      selected={selected}
    />
  );

  if (!onClick) {
    return (
      <div style={style} className="absolute">
        {bubble}
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
        className="absolute cursor-default"
      >
        {bubble}
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
      className="absolute"
    >
      {bubble}
    </button>
  );
};

export default TagPin;
