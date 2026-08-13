import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { formatDate } from '../lib/formatDate';
import { WEARING_TARGET_LABEL } from '../lib/wearingTargetLabel';
import type { ItemDetail } from '../model/items';

interface ItemInfoSectionProps {
  item: ItemDetail;
  allowProposal: boolean;
}

const ItemInfoSection = ({ item, allowProposal }: ItemInfoSectionProps) => {
  const isForSale = item.itemStatus === 'ON_SALE';

  return (
    <div className="border-border-light flex gap-4 border-b-2 p-4">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-gray-bg size-[28vw] max-h-46 max-w-46 overflow-hidden rounded-lg">
          <img
            src={resolveImageUrl(item.representativeImageUrl)}
            alt={item.itemName}
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
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
          최초 보유 날짜 {item.firstOwnedAt ? formatDate(item.firstOwnedAt) : '기록 없음'}
        </p>
        {isForSale ? (
          <span className="text-body-1 text-info font-semibold">판매 중</span>
        ) : (
          <p className="text-body-1 text-info font-semibold">
            미판매 · 구매 제안 {allowProposal ? 'O' : 'X'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemInfoSection;
