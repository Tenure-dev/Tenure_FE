import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import OotdMoreGridPage from '@/features/search/ui/OotdMoreGridPage';
import type { SearchOotdResponse } from '@/features/search/api/types';

interface RelatedOotdMoreState {
  title: string;
  items: SearchOotdResponse[];
}

// getRelatedOotds는 커서 페이지네이션이 없는 고정 리스트라 별도 API 없이,
// RelatedOotdPage에서 이미 불러온 목록을 그대로 받아 기존 검색 더보기 페이지와 동일한
// 2열 그리드(OotdMoreGridPage)로 보여준다.
const RelatedOotdMorePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RelatedOotdMoreState | null;

  useEffect(() => {
    if (!state) navigate(`/ootd/${id}/related`, { replace: true });
  }, [state, id, navigate]);

  if (!state) return null;

  return (
    <OotdMoreGridPage
      title={state.title}
      items={state.items}
      hasNext={false}
      loading={false}
      onLoadMore={() => {}}
    />
  );
};

export default RelatedOotdMorePage;
