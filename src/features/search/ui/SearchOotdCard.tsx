import { Bookmark, Heart } from 'lucide-react';
import type { SearchOotdResponse } from '../api/types';

export interface SearchOotdCardProps {
  item: SearchOotdResponse;
  liked: boolean;
  bookmarked: boolean;
  onClick: () => void;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
}

// BE의 SearchOotdResponse가 아직 liked/bookmarked를 내려주지 않아, 좋아요/북마크는
// 화면(로컬) 상태로만 토글된다 — Feed 탭의 기존 좋아요/북마크와 동일한 수준의 미구현 상태.
const SearchOotdCard = ({
  item,
  liked,
  bookmarked,
  onClick,
  onToggleLike,
  onToggleBookmark,
}: SearchOotdCardProps) => {
  return (
    <div className="bg-gray-bg relative w-full overflow-hidden rounded-md">
      <button type="button" onClick={onClick} className="block w-full">
        <img src={item.imageUrl} alt="" loading="lazy" className="w-full object-cover" />
      </button>
      <div className="absolute right-2 bottom-2 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleLike}
          aria-label={liked ? '좋아요 취소' : '좋아요'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Heart
            size={18}
            className={liked ? 'fill-brand text-brand' : 'fill-black/20 text-white'}
          />
        </button>
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label={bookmarked ? '북마크 취소' : '북마크'}
          className="inline-flex size-6 items-center justify-center"
        >
          <Bookmark
            size={18}
            className={bookmarked ? 'fill-white text-white' : 'fill-black/20 text-white'}
          />
        </button>
      </div>
    </div>
  );
};

export default SearchOotdCard;
