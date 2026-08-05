import { useQuery } from '@tanstack/react-query';
import { getFollowings } from '../api/feedApi';
import { getCurrentUserId } from '@/features/search/lib/currentUser';

export const useFollowings = () => {
  const userId = getCurrentUserId();

  return useQuery({
    queryKey: ['followings', userId],
    queryFn: () => getFollowings(userId!),
    enabled: userId !== null,
  });
};
