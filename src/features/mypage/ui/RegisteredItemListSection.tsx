import type { RegisteredItem } from '../model/items';
import RegisteredItemRow from './RegisteredItemRow';

interface RegisteredItemListSectionProps {
  items: RegisteredItem[];
  onItemClick: (id: number) => void;
  onSaleConvert?: (id: number) => void;
}

const RegisteredItemListSection = ({
  items,
  onItemClick,
  onSaleConvert,
}: RegisteredItemListSectionProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.itemId}>
          <RegisteredItemRow
            item={item}
            onClick={() => onItemClick(item.itemId)}
            onSaleConvert={onSaleConvert ? () => onSaleConvert(item.itemId) : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

export default RegisteredItemListSection;
