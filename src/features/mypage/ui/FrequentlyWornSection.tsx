import type { FrequentlyWornItem } from '@/features/mypage/model/items';

interface FrequentlyWornSectionProps {
  items: FrequentlyWornItem[];
}

const FrequentlyWornSection = ({ items }: FrequentlyWornSectionProps) => {
  return (
    <section className="border-border-light border-b-2 p-4">
      <h2 className="text-title-3 mb-3 font-medium">자주 같이 입은 옷</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.itemId}
            className="border-border text-body-2 text-text-primary rounded-full border px-3 py-1.5"
          >
            {item.brandName} / {item.itemName}
          </span>
        ))}
      </div>
    </section>
  );
};

export default FrequentlyWornSection;
