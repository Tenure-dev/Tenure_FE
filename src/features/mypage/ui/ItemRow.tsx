import { Button } from '@/shared/components';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { getDaysAgo } from '../lib/daysAgo';
import { ITEM_STATUS_LABEL } from '../lib/statusLabel';
import type { Item } from '../model/items';

interface ItemRowProps {
  item: Item;
  onClick: () => void;
  onSaleConvert?: () => void;
}

const ItemRow = ({ item, onClick, onSaleConvert }: ItemRowProps) => {
  const wornInfo = item.lastWornAt
    ? `최근 착용 ${getDaysAgo(item.lastWornAt)}일 전`
    : '착용 기록 없음';
  const statusText = `${ITEM_STATUS_LABEL[item.itemStatus]} · ${wornInfo}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="border-border-light flex items-center gap-3 border-b px-4 py-3"
    >
      <div className="bg-gray-bg size-[17vw] max-h-25 max-w-25 shrink-0 overflow-hidden rounded-lg">
        <img
          src={resolveImageUrl(item.representativeImageUrl)}
          alt={item.itemName}
          className="size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-body-2 text-text-primary font-medium">
          {item.brandName} / {item.itemName}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">{statusText}</p>
      </div>
      {item.itemStatus === 'OWNED' && (
        <Button
          variant="solid"
          size="36"
          className="text-body-3 text-text-secondary w-auto shrink-0 px-2 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onSaleConvert?.();
          }}
        >
          판매 전환
        </Button>
      )}
    </div>
  );
};

export default ItemRow;
