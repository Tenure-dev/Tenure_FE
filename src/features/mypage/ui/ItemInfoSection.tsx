import cn from '@/shared/lib/cn';
import { Toggle } from '@/shared/components';
import type { RegisteredItemDetail } from '../model/items';

interface ItemInfoSectionProps {
  item: RegisteredItemDetail;
  allowProposal: boolean;
  onToggleProposal: (v: boolean) => void;
}

const ItemInfoSection = ({ item, allowProposal, onToggleProposal }: ItemInfoSectionProps) => {
  return (
    <div className="border-border-light flex gap-4 border-b-2 p-4">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-gray-bg size-[28vw] max-h-46 max-w-46 overflow-hidden rounded-lg">
          <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
        </div>
        <span className="text-body-4 font-regular text-text-secondary">대표사진</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-body-2 font-regular text-text-secondary">관련 정보</span>
        <p className="text-body-2 text-text-primary">
          {item.category} · {item.subCategory}
        </p>
        <p className="text-body-2 text-text-primary">
          {item.gender} · 사이즈 {item.size}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">
          관심 {item.interestedCount}명 · 최근 착용 {item.lastWornDate}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">
          최초 보유 날짜 {item.acquiredDate}
        </p>
        {item.forSale ? (
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
