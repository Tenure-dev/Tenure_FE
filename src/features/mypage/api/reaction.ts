import { api } from '@/shared/lib/api';

/** 좋아요(하트) 등록 (멱등) */
export const heartOotd = (ootdId: number) => api.post<void>(`/ootds/${ootdId}/heart`);

/** 좋아요(하트) 취소 */
export const unheartOotd = (ootdId: number) => api.delete<void>(`/ootds/${ootdId}/heart`);

/** 저장 등록 (멱등) */
export const saveOotd = (ootdId: number) => api.post<void>(`/ootds/${ootdId}/save`);

/** 저장 취소 */
export const unsaveOotd = (ootdId: number) => api.delete<void>(`/ootds/${ootdId}/save`);
