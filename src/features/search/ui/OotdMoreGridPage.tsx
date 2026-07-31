import { useNavigate } from 'react-router-dom';
import { leftArrow } from '@/shared/assets';
import search from '@/shared/assets/search.svg';
import type { SearchOotdResponse } from '../api/types';
import { useScrollToTop } from '../lib/useScrollToTop';
import OotdResultGrid from './OotdResultGrid';

export interface OotdMoreGridPageProps {
  title: string;
  items: SearchOotdResponse[];
  hasNext: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const OotdMoreGridPage = ({
  title,
  items,
  hasNext,
  loading,
  onLoadMore,
}: OotdMoreGridPageProps) => {
  useScrollToTop();
  const navigate = useNavigate();

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <button type="button" onClick={() => navigate('/search')} aria-label="검색">
          <img src={search} alt="" className="size-5" />
        </button>
      </header>

      <h1 className="text-title-3 text-text-primary px-4 pt-2 pb-4 font-bold">{title}</h1>

      <div className="px-4 pb-8">
        <OotdResultGrid items={items} hasNext={hasNext} loading={loading} onLoadMore={onLoadMore} />
      </div>
    </div>
  );
};

export default OotdMoreGridPage;
