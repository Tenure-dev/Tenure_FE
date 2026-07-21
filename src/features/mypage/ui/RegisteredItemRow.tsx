import { Button } from '@/shared/components';
import type { RegisteredItem } from '../model/items';

interface RegisteredItemRowProps {
  item: RegisteredItem;
  onClick: () => void;
  onSaleConvert?: () => void;
}

const RegisteredItemRow = ({ item, onClick, onSaleConvert }: RegisteredItemRowProps) => {
  const statusText = `${item.forSale ? '판매중' : '미판매'} · 최근 착용 ${item.lastWornDaysAgo}일 전`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="border-border-light flex items-center gap-3 border-b px-4 py-3"
    >
      <div className="bg-gray-bg size-[17vw] max-h-25 max-w-25 shrink-0 overflow-hidden rounded-lg">
        <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-body-2 text-text-primary font-medium">
          {item.brand} / {item.name}
        </p>
        <p className="text-body-3 font-regular text-text-secondary">{statusText}</p>
      </div>
      {!item.forSale && (
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

export default RegisteredItemRow;
