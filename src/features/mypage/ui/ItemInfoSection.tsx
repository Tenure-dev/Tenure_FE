import cn from '@/shared/lib/cn';
import { Toggle } from '@/shared/components';
import { formatDate } from '../lib/formatDate';
import { WEARING_TARGET_LABEL } from '../lib/wearingTargetLabel';
import type { RegisteredItemDetail } from '../model/items';

interface ItemInfoSectionProps {
  item: RegisteredItemDetail;
  allowProposal: boolean;
  onToggleProposal: (v: boolean) => void;
}

const ItemInfoSection = ({ item, allowProposal, onToggleProposal }: ItemInfoSectionProps) => {
  const isForSale = item.itemStatus === 'ON_SALE';

  return (
    <div className="border-border-light flex gap-4 border-b-2 p-4">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-gray-bg size-[28vw] max-h-46 max-w-46 overflow-hidden rounded-lg">
          <img
            src={item.representativeImageUrl}
            alt={item.itemName}
            className="size-full object-cover"
          />
        </div>
        <span className="text-body-4 font-regular text-text-secondary">대표사진</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-body-2 font-regular text-text-secondary">관련 정보</span>
        <p className="text-body-2 text-text-primary">
          {item.categoryLarge} · {item.categorySmall}
        </p>
        <p className="text-body-2 text-text-primary">
          {WEARING_TARGET_LABEL[item.wearingTarget]} · 사이즈 {item.sizeSystem} {item.sizeValue}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">
          관심 {item.wishCount}명 · 최근 착용{' '}
          {item.lastWornAt ? formatDate(item.lastWornAt) : '기록 없음'}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">
          최초 보유 날짜 {formatDate(item.firstOwnedAt)}
        </p>
        {isForSale ? (
          <span className="text-body-1 text-info font-semibold">판매 중</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-body-1 text-info font-semibold">미판매</span>
            <span className="text-body-1 text-text-secondary">·</span>
            <span
              className={cn(
                'text-body-1 font-semibold',
                allowProposal ? 'text-info' : 'text-text-tertiary',
              )}
            >
              구매 제안 받기
            </span>
            <Toggle checked={allowProposal} onChange={onToggleProposal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemInfoSection;
