import { api } from '@/shared/lib/api';
import type { MyPageResponse } from './dto';

/** 마이페이지 조회 (프로필 + 통계) */
// 팀 공용 api는 인터셉터에서 BaseResponse.data를 언래핑해 Promise<T>를 바로 반환한다.
export const getMyPage = () => api.get<MyPageResponse>('/my-page');
