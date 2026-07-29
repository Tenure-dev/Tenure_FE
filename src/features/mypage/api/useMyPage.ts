import { useQuery } from '@tanstack/react-query';
import { getMyPage } from './mypage';
import type { MyPageResponse } from './dto';

export const myPageQueryKey = ['my-page'] as const;

/** 마이페이지 프로필·통계 조회 */
export const useMyPage = () =>
  useQuery<MyPageResponse>({
    queryKey: myPageQueryKey,
    queryFn: getMyPage,
    staleTime: 60_000,
    refetchOnMount: 'always',
  });

export default useMyPage;
