import { cn } from '@/shared/lib/cn';
import type { TaggedItem } from '@/features/ootd/model/types';

export interface TagPinProps {
  item: TaggedItem;
  selected?: boolean;
  onClick?: () => void;
}

const TagPin = ({ item, selected = false, onClick }: TagPinProps) => {
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

  const style = { left: `${item.position.x}%`, top: `${item.position.y}%` };
  const className = cn(
    'absolute max-w-[170px] -translate-x-1/2 -translate-y-full rounded-lg bg-bg-white/95 px-3 py-1.5 text-left shadow-md',
    selected && 'ring-2 ring-brand',
  );

  if (!onClick) {
    return (
      <div style={style} className={className}>
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
