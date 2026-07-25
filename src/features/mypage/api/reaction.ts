import { reactionClient } from './reactionClient';

// 하트/저장은 204 No Content라 공용 api 대신 reactionClient 사용 (204를 성공으로 처리)

/** 좋아요(하트) 등록 (멱등) */
export const heartOotd = (ootdId: number) => reactionClient.post(`/ootds/${ootdId}/heart`);

/** 좋아요(하트) 취소 */
export const unheartOotd = (ootdId: number) => reactionClient.delete(`/ootds/${ootdId}/heart`);

/** 저장 등록 (멱등) */
export const saveOotd = (ootdId: number) => reactionClient.post(`/ootds/${ootdId}/save`);

/** 저장 취소 */
export const unsaveOotd = (ootdId: number) => reactionClient.delete(`/ootds/${ootdId}/save`);
