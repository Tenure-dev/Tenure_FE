import { useNavigate } from 'react-router-dom';
import type { SearchOotdResponse } from '../api/types';
import { useInfiniteScrollSentinel } from '../lib/useInfiniteScrollSentinel';

export interface OotdResultGridProps {
  items: SearchOotdResponse[];
  hasNext: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const OotdResultGrid = ({ items, hasNext, loading, onLoadMore }: OotdResultGridProps) => {
  const navigate = useNavigate();
  const sentinelRef = useInfiniteScrollSentinel(hasNext, onLoadMore);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(`/ootd/${item.id}`)}
            className="bg-gray-bg aspect-[3/4] overflow-hidden rounded-lg"
          >
            <img src={item.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
          </button>
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
