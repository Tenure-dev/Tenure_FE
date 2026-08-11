import { useQuery } from '@tanstack/react-query';
import { getUserFeedProfile } from '../api/userApi';

// 유저 상세(피드 페이지 상단) 프로필 조회 — 게시물 목록이 아니라 프로필/카운트/팔로우 정보.
export const useUserFeedProfileQuery = (userId: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['users', userId, 'feed-profile'] as const,
    queryFn: () => getUserFeedProfile(userId),
    enabled: options?.enabled !== false && userId > 0,
    staleTime: 5 * 60 * 1000,
  });
