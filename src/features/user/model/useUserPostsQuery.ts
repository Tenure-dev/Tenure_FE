import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '../api/userApi';

// 유저 프로필 하단 OOTD 피드(공개 게시물) 조회.
export const useUserPostsQuery = (userId: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['users', userId, 'ootds'] as const,
    queryFn: () => getUserPosts(userId),
    enabled: options?.enabled !== false && userId > 0,
    staleTime: 60 * 1000,
  });
