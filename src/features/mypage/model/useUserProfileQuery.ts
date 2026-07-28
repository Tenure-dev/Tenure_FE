import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/usersApi';

export const useUserProfileQuery = (userId: number) =>
  useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserProfile(userId),
  });
