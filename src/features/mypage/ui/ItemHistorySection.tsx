import type { ItemHistoryEntry } from '../model/items';
import HistoryCard from './HistoryCard';

const ItemHistorySection = ({ history }: { history: ItemHistoryEntry[] }) => {
  return (
    <section className="p-4">
      <h2 className="text-title-3 mb-3 font-medium">아이템 히스토리</h2>
      <div className="flex gap-3 overflow-x-auto p-1">
        {history.map((entry) => (
          <div key={entry.userId} className="shrink-0">
            <HistoryCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItemHistorySection;
