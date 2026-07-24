import { api } from '@/shared/lib/api';

/** 좋아요(하트) 취소 */
export const unheartOotd = (ootdId: number) => api.delete<void>(`/ootds/${ootdId}/heart`);

/** 저장 취소 */
export const unsaveOotd = (ootdId: number) => api.delete<void>(`/ootds/${ootdId}/save`);
