import { api } from '@/shared/lib/api';
import type { OotdCreateResponse, OotdTagInput } from './dto';

// 게시: 앱 카메라 촬영 이미지 + (선택)태그를 multipart로 한 번에 전송.
// tags를 함께 보내면 게시와 동시에 해당 태그를 CONFIRMED 상태로 등록한다.
// (AI 태그 분석은 서버가 OOTD_CREATED 이벤트로 백그라운드에서 비동기 처리)
export const createOotd = (image: File, tags?: OotdTagInput[]) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('source', 'CAMERA');
  if (tags && tags.length > 0) {
    // 백엔드는 tags 파트를 JSON 문자열로 받는다: {"tags":[{itemId,bbox,labelText}]}
    formData.append('tags', JSON.stringify({ tags }));
  }

  return api.post<OotdCreateResponse>('/ootds', formData, {
    headers: { 'Content-Type': undefined },
  });
};
