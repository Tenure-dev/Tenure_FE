import type { FeedCard } from '@/features/feed/model/types';
import useIsWideLayout from '@/shared/hooks/useIsWideLayout';
import FeedCardComponent from './FeedCard';

export interface FeedGridProps {
  items: FeedCard[];
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
}

const splitIntoColumns = (items: FeedCard[], columnCount: number) => {
  const columns: FeedCard[][] = Array.from({ length: columnCount }, () => []);

  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return columns;
};

const FeedGrid = ({ items, onToggleLike, onToggleBookmark }: FeedGridProps) => {
  const isWideLayout = useIsWideLayout();
  const columns = splitIntoColumns(items, isWideLayout ? 3 : 2);

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-2">
          {column.map((item) => (
            <FeedCardComponent
              key={item.ootdId}
              item={item}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FeedGrid;
