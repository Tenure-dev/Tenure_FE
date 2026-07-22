import { useNavigate } from 'react-router-dom';
import type { SearchOotdResponse } from '../api/types';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';
import SearchOotdCard from './SearchOotdCard';

const COLUMN_COUNT = 2;

const splitIntoColumns = <T,>(items: T[], columnCount: number) => {
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => columns[index % columnCount].push(item));
  return columns;
};

export interface SearchOotdResultGridProps {
  items: SearchOotdResponse[];
  hasNext: boolean;
  loading: boolean;
  onLoadMore: () => void;
  likedIds: Set<number>;
  bookmarkedIds: Set<number>;
  onToggleLike: (id: number) => void;
  onToggleBookmark: (id: number) => void;
}

// 검색 결과 게시물 탭 전용 그리드. 이미지 원본 비율 그대로 쌓는 매이슨리 레이아웃이라
// BE에 별도의 ratio 필드가 없어도 목업의 들쭉날쭉한 카드 높이를 그대로 재현한다.
const SearchOotdResultGrid = ({
  items,
  hasNext,
  loading,
  onLoadMore,
  likedIds,
  bookmarkedIds,
  onToggleLike,
  onToggleBookmark,
}: SearchOotdResultGridProps) => {
  const navigate = useNavigate();
  const sentinelRef = useInfiniteScrollSentinel(hasNext, onLoadMore);
  const columns = splitIntoColumns(items, COLUMN_COUNT);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-2">
            {column.map((item) => (
              <SearchOotdCard
                key={item.id}
                item={item}
                liked={likedIds.has(item.id)}
                bookmarked={bookmarkedIds.has(item.id)}
                onClick={() => navigate(`/ootd/${item.id}`)}
                onToggleLike={() => onToggleLike(item.id)}
                onToggleBookmark={() => onToggleBookmark(item.id)}
              />
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

export default SearchOotdResultGrid;
