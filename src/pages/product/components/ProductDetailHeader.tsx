import { moreOptions, share } from '@/shared/assets';
import { BackHeader } from '@/shared/components';

export interface ItemDetailHeaderProps {
  onShareClick: () => void;
  onMoreClick?: () => void;
}

const ItemDetailHeader = ({ onShareClick, onMoreClick }: ItemDetailHeaderProps) => (
  <BackHeader
    title="아이템 상세"
    rightActions={
      <>
        <button type="button" onClick={onShareClick} aria-label="공유하기">
          <img src={share} alt="" className="size-5" />
        </button>
        {onMoreClick && (
          <button type="button" onClick={onMoreClick} aria-label="더보기옵션">
            <img src={moreOptions} alt="" className="size-5" />
          </button>
        )}
      </>
    }
  />
);

export default ItemDetailHeader;
