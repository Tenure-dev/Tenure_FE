import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/userApi';

export const useUserQuery = (userId: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['users', userId] as const,
    queryFn: () => getUserProfile(userId),
    enabled: options?.enabled !== false && userId > 0,
    staleTime: 5 * 60 * 1000,
  });
