import { getPopularOotds } from '@/features/search/api/searchApi';
import { useCursorList } from '@/features/search/lib/useCursorList';
import OotdMoreGridPage from '@/features/search/ui/OotdMoreGridPage';

const SearchPopularOotdsPage = () => {
  const { items, hasNext, loading, loadMore } = useCursorList(getPopularOotds);

  return (
    <OotdMoreGridPage
      title="지금 인기 있는 스타일"
      items={items}
      hasNext={hasNext}
      loading={loading}
      onLoadMore={loadMore}
    />
  );
};

export default SearchPopularOotdsPage;
