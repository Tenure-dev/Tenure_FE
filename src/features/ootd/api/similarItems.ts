import { api } from '@/shared/lib/api';
import type { SimilarItemResponse } from './dto';

// 태그 작성용 유사 아이템 추천.
// ootdId 없이 호출하면 보유 아이템 상위 limit개, 주면 그 게시물 확정 태그 기준 우선 정렬.
export const getSimilarItems = (limit = 10, ootdId?: number) => {
  console.log('실행');
  return api.get<SimilarItemResponse[]>('/ootds/tags/similar-items', {
    params: { limit, ...(ootdId != null && { ootdId }) },
  });
};
