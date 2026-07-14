import { Bookmark, Heart } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { FeedItem } from '@/features/feed/model/types';

const cardVariants = cva('w-full overflow-hidden rounded-md bg-gray-bg', {
  variants: {
    ratio: {
      '4:5': 'aspect-[4/5]',
      '1:1': 'aspect-square',
      '3:4': 'aspect-[3/4]',
    },
  },
});

export interface FeedCardProps {
  item: FeedItem;
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  className?: string;
}

const FeedCard = ({ item, onToggleLike, onToggleBookmark, className }: FeedCardProps) => {
  return (
    <div className={cn('relative', cardVariants({ ratio: item.ratio }), className)}>
      <img src={item.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
      <div className="absolute right-2 bottom-2 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => onToggleLike?.(item.id)}
          aria-label={item.liked ? '좋아요 취소' : '좋아요'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Heart
            size={18}
            className={item.liked ? 'fill-brand text-brand' : 'fill-black/20 text-white'}
          />
        </button>
        <button
          type="button"
          onClick={() => onToggleBookmark?.(item.id)}
          aria-label={item.bookmarked ? '북마크 취소' : '북마크'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Bookmark
            size={18}
            className={item.bookmarked ? 'fill-white text-white' : 'fill-black/20 text-white'}
          />
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
