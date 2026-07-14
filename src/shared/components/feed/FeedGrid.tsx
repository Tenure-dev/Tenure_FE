import type { FeedItem } from '@/features/feed/model/types';
import useIsWideLayout from '@/shared/hooks/useIsWideLayout';
import FeedCard from './FeedCard';

export interface FeedGridProps {
  items: FeedItem[];
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
}

// 컬럼 수에 따라 아이템을 분할하는 함수
const splitIntoColumns = (items: FeedItem[], columnCount: number) => {
  const columns: FeedItem[][] = Array.from({ length: columnCount }, () => []);

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
            <FeedCard
              key={item.id}
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
