import type { RegisteredItem } from '../model/items';
import RegisteredItemRow from './RegisteredItemRow';

interface RegisteredItemListSectionProps {
  items: RegisteredItem[];
  onItemClick: (id: string) => void;
}

const RegisteredItemListSection = ({ items, onItemClick }: RegisteredItemListSectionProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <RegisteredItemRow item={item} onClick={() => onItemClick(item.id)} />
        </li>
      ))}
    </ul>
  );
};

export default RegisteredItemListSection;
