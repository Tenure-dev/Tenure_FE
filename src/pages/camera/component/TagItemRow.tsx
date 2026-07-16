import { cn } from '@/shared/lib/cn';
import type { OotdItem } from '@/features/ootd/model/item';

type Props = {
  item: OotdItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

const TagItemRow = ({ item, selected, onToggle }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className={cn(
        'bg-bg-50 flex w-full items-center gap-3 rounded-xl border p-3 text-left',
        selected ? 'border-brand' : 'border-transparent',
      )}
    >
      {item.thumbnail ? (
        <img src={item.thumbnail} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="bg-bg-200 size-12 shrink-0 rounded-full" />
      )}
      <div className="min-w-0">
        <p className="text-body-2 truncate font-semibold">
          {item.brand} / {item.name}
        </p>
        <p className="text-body-4 text-text-secondary truncate">{item.meta}</p>
      </div>
    </button>
  );
};

export default TagItemRow;
