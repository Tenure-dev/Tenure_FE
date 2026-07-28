import { useItemHistoryQuery } from '../model/useItemHistoryQuery';
import HistoryCard from './HistoryCard';

const ItemHistorySection = ({ itemId }: { itemId: number }) => {
  const { data } = useItemHistoryQuery(itemId);
  const entries = data?.content ?? [];

  return (
    <section className="p-4">
      <h2 className="text-title-3 mb-3 font-medium">아이템 히스토리</h2>
      <div className="flex gap-3 overflow-x-auto p-1">
        {entries.map((entry) => (
          <div key={entry.historyId} className="shrink-0">
            <HistoryCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItemHistorySection;
