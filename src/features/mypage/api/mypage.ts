import { api } from './client';
import type { MyPageResponse } from './dto';

/** 마이페이지 조회 (프로필 + 통계) */
export const getMyPage = async (): Promise<MyPageResponse> => {
  const { data } = await api.get<MyPageResponse>('/my-page');
  return data;
};
