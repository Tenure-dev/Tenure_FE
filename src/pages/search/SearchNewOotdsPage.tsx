import { getNewOotds } from '@/features/search/api/searchApi';
import { useCursorList } from '@/features/search/lib/useCursorList';
import OotdMoreGridPage from '@/features/search/ui/OotdMoreGridPage';

const SearchNewOotdsPage = () => {
  const { items, hasNext, loading, loadMore } = useCursorList(getNewOotds);

  return (
    <OotdMoreGridPage
      title="새로 올라온 OOTD"
      items={items}
      hasNext={hasNext}
      loading={loading}
      onLoadMore={loadMore}
    />
  );
};

export default SearchNewOotdsPage;
