import { useNavigate } from 'react-router-dom';
import { moreOptions, share, leftArrow } from '@/shared/assets';

export interface ItemDetailHeaderProps {
  onShareClick: () => void;
  onMoreClick: () => void;
}

const ItemDetailHeader = ({ onShareClick, onMoreClick }: ItemDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-light bg-bg-white sticky top-0 z-20 flex h-[52px] items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <h1 className="text-title-4 text-text-primary translate-y-0.25 font-medium">아이템 상세</h1>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onShareClick} aria-label="공유하기">
          <img src={share} alt="" className="size-5" />
        </button>
        <button type="button" onClick={onMoreClick} aria-label="더보기옵션">
          <img src={moreOptions} alt="" className="size-5" />
        </button>
      </div>
    </header>
  );
};

export default ItemDetailHeader;
