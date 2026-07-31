import { Bookmark, Heart } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { FeedGridItem } from '@/features/feed/model/types';
import { useToggleHeart } from '@/features/ootd/model/useToggleHeart';
import { useToggleSave } from '@/features/ootd/model/useToggleSave';

export interface FeedCardProps {
  item: FeedGridItem;
  className?: string;
}

const FeedCard = ({ item, className }: FeedCardProps) => {
  const { hearted, toggle: toggleHeart } = useToggleHeart(Number(item.ootdId), item.hearted);
  const { saved, toggle: toggleSave } = useToggleSave(Number(item.ootdId), item.saved);

  return (
    <div className={cn('bg-gray-bg relative w-full overflow-hidden rounded-md', className)}>
      <img src={item.imageUrl} alt="" loading="lazy" className="block h-auto w-full" />
      <div className="absolute right-2 bottom-2 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={toggleHeart}
          aria-label={hearted ? '좋아요 취소' : '좋아요'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Heart
            size={18}
            className={hearted ? 'fill-brand text-brand' : 'fill-black/20 text-white'}
          />
        </button>
        <button
          type="button"
          onClick={toggleSave}
          aria-label={saved ? '북마크 취소' : '북마크'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Bookmark
            size={18}
            className={saved ? 'fill-white text-white' : 'fill-black/20 text-white'}
          />
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
