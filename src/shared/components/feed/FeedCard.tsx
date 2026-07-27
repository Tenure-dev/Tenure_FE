import { Bookmark, Heart } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { FeedGridItem } from '@/features/feed/model/types';

export interface FeedCardProps {
  item: FeedGridItem;
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  className?: string;
}

const FeedCard = ({ item, onToggleLike, onToggleBookmark, className }: FeedCardProps) => {
  return (
    <div className={cn('bg-gray-bg relative w-full overflow-hidden rounded-md', className)}>
      <img src={item.imageUrl} alt="" loading="lazy" className="block h-auto w-full" />
      <div className="absolute right-2 bottom-2 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => onToggleLike?.(String(item.ootdId))}
          aria-label={item.hearted ? '좋아요 취소' : '좋아요'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Heart
            size={18}
            className={item.hearted ? 'fill-brand text-brand' : 'fill-black/20 text-white'}
          />
        </button>
        <button
          type="button"
          onClick={() => onToggleBookmark?.(String(item.ootdId))}
          aria-label={item.saved ? '북마크 취소' : '북마크'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Bookmark
            size={18}
            className={item.saved ? 'fill-white text-white' : 'fill-black/20 text-white'}
          />
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
