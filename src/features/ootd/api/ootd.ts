import { api } from '@/shared/lib/api';
import type { OotdCreateResponse, OotdTagInput } from './dto';

export const createOotd = (image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('source', 'CAMERA');

  return api.post<OotdCreateResponse>('/ootds', formData, {
    headers: { 'Content-Type': undefined },
  });
};

// 게시 시점 태그 일괄 등록 (기존 태그 삭제 후 대체, 전부 CONFIRMED로 저장)
export const createTagsBatch = (ootdId: number, tags: OotdTagInput[]) => {
  return api.post<unknown>(`/ootds/${ootdId}/tags/batch`, { tags });
};
