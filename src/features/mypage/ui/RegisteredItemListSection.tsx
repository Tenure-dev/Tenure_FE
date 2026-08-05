import type { Item } from '../model/items';
import ItemRow from './ItemRow';

interface ItemListSectionProps {
  items: Item[];
  onItemClick: (id: number) => void;
  onSaleConvert?: (id: number) => void;
}

const ItemListSection = ({ items, onItemClick, onSaleConvert }: ItemListSectionProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.itemId}>
          <ItemRow
            item={item}
            onClick={() => onItemClick(item.itemId)}
            onSaleConvert={onSaleConvert ? () => onSaleConvert(item.itemId) : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

export default ItemListSection;
