import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { saveRecentOotd } from '../api/searchApi';
import type { SearchOotdResponse } from '../api/types';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';

export interface OotdResultGridProps {
  items: SearchOotdResponse[];
  hasNext: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const COLUMN_COUNT = 2;

const splitIntoColumns = (items: SearchOotdResponse[], columnCount: number) => {
  const columns: SearchOotdResponse[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => columns[index % columnCount].push(item));
  return columns;
};

// 촬영 시 고른 비율(3:4, 4:5, 1:1 등)이 그대로 보이도록 고정 aspect로 자르지 않고,
// 매이슨리(2열 flex 컬럼)로 쌓아 이미지 원본 비율을 유지한다.
const OotdResultGrid = ({ items, hasNext, loading, onLoadMore }: OotdResultGridProps) => {
  const navigate = useNavigate();
  const sentinelRef = useInfiniteScrollSentinel(hasNext, onLoadMore);
  const columns = splitIntoColumns(items, COLUMN_COUNT);

  const handleClick = (id: number) => {
    saveRecentOotd(id);
    navigate(`/ootd/${id}`);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-2">
            {column.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className="bg-gray-bg block w-full overflow-hidden rounded-lg"
              >
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt=""
                  loading="lazy"
                  className="block w-full object-cover"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {hasNext && <div ref={sentinelRef} className="h-10" />}
      {loading && (
        <p className="text-body-3 text-text-tertiary pt-4 pb-6 text-center">불러오는 중...</p>
      )}
    </>
  );
};

export default OotdResultGrid;
