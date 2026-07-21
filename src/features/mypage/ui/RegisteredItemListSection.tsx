import type { RegisteredItem } from '../model/items';
import RegisteredItemRow from './RegisteredItemRow';

interface RegisteredItemListSectionProps {
  items: RegisteredItem[];
  onItemClick: (id: string) => void;
  onSaleConvert?: (id: string) => void;
}

const RegisteredItemListSection = ({
  items,
  onItemClick,
  onSaleConvert,
}: RegisteredItemListSectionProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <RegisteredItemRow
            item={item}
            onClick={() => onItemClick(item.id)}
            onSaleConvert={onSaleConvert ? () => onSaleConvert(item.id) : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

export default RegisteredItemListSection;
