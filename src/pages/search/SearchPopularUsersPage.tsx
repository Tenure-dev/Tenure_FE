import { useNavigate } from 'react-router-dom';
import { leftArrow } from '@/shared/assets';
import search from '@/shared/assets/search.svg';
import PopularUsersMoreList from '@/features/search/ui/PopularUsersMoreList';
import { useScrollToTop } from '@/features/search/lib/useScrollToTop';

const SearchPopularUsersPage = () => {
  useScrollToTop();
  const navigate = useNavigate();

  return (
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <button type="button" onClick={() => navigate('/search')} aria-label="검색">
          <img src={search} alt="" className="size-5" />
        </button>
      </header>

      <h1 className="text-title-3 text-text-primary px-4 pt-2 pb-4 font-bold">인기 사용자</h1>

      <PopularUsersMoreList />
    </div>
  );
};

export default SearchPopularUsersPage;
