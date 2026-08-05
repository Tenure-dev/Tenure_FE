import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyFollowers, getMyFollowings, type FollowUser } from '../api/followListApi';
import { followUser, unfollowUser } from '@/features/search/api/followApi';

export const followListQueryKeys = {
  followers: ['my-followers'] as const,
  followings: ['my-followings'] as const,
};

export const useMyFollowers = () =>
  useQuery({
    queryKey: followListQueryKeys.followers,
    queryFn: getMyFollowers,
    staleTime: 60_000,
  });

export const useMyFollowings = () =>
  useQuery({
    queryKey: followListQueryKeys.followings,
    queryFn: getMyFollowings,
    staleTime: 60_000,
  });

export const useToggleFollowInList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, following }: { userId: number; following: boolean }) =>
      following ? unfollowUser(userId) : followUser(userId),

    onMutate: async ({ userId, following }) => {
      await queryClient.cancelQueries({ queryKey: followListQueryKeys.followers });
      await queryClient.cancelQueries({ queryKey: followListQueryKeys.followings });

      const prevFollowers = queryClient.getQueryData<FollowUser[]>(followListQueryKeys.followers);
      const prevFollowings = queryClient.getQueryData<FollowUser[]>(followListQueryKeys.followings);

      const toggle = (list: FollowUser[] | undefined) =>
        list?.map((u) => (u.userId === userId ? { ...u, following: !following } : u));

      queryClient.setQueryData(followListQueryKeys.followers, toggle(prevFollowers));
      queryClient.setQueryData(followListQueryKeys.followings, toggle(prevFollowings));

      return { prevFollowers, prevFollowings };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevFollowers !== undefined) {
        queryClient.setQueryData(followListQueryKeys.followers, context.prevFollowers);
      }
      if (context?.prevFollowings !== undefined) {
        queryClient.setQueryData(followListQueryKeys.followings, context.prevFollowings);
      }
    },
  });
};
