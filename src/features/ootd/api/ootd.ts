import { api } from '@/shared/lib/api';
import type { OotdCreateResponse } from './dto';

export const createOotd = (image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('source', 'CAMERA');

  return api.post<OotdCreateResponse>('/ootds', formData, {
    headers: { 'Content-Type': undefined },
  });
};
