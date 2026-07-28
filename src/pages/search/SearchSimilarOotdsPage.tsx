import { getSimilarOotds } from '@/features/search/api/searchApi';
import { useCursorList } from '@/features/search/lib/useCursorList';
import OotdMoreGridPage from '@/features/search/ui/OotdMoreGridPage';

const SearchSimilarOotdsPage = () => {
  const { items, hasNext, loading, loadMore } = useCursorList(getSimilarOotds);

  return (
    <OotdMoreGridPage
      title="방금 본 OOTD와 유사한 게시물"
      items={items}
      hasNext={hasNext}
      loading={loading}
      onLoadMore={loadMore}
    />
  );
};

export default SearchSimilarOotdsPage;
