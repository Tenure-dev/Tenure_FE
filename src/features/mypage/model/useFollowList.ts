import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyFollowers,
  getMyFollowings,
  getUserFollowers,
  getUserFollowings,
  type FollowUser,
} from '../api/followListApi';
import { followUser, unfollowUser } from '@/features/search/api/followApi';

// scopeUserId 없으면 내 목록, 있으면 해당 유저 목록. 캐시 키도 스코프별로 분리한다.
const followersKey = (scopeUserId?: number) =>
  ['follow', 'followers', scopeUserId ?? 'me'] as const;
const followingsKey = (scopeUserId?: number) =>
  ['follow', 'followings', scopeUserId ?? 'me'] as const;

export const useFollowers = (scopeUserId?: number) =>
  useQuery({
    queryKey: followersKey(scopeUserId),
    queryFn: () => (scopeUserId != null ? getUserFollowers(scopeUserId) : getMyFollowers()),
    staleTime: 60_000,
  });

export const useFollowings = (scopeUserId?: number) =>
  useQuery({
    queryKey: followingsKey(scopeUserId),
    queryFn: () => (scopeUserId != null ? getUserFollowings(scopeUserId) : getMyFollowings()),
    staleTime: 60_000,
  });

// 목록 내 팔로우 토글. 현재 보고 있는 스코프(내/유저)의 캐시를 낙관적으로 갱신한다.
export const useToggleFollowInList = (scopeUserId?: number) => {
  const queryClient = useQueryClient();
  const fKey = followersKey(scopeUserId);
  const gKey = followingsKey(scopeUserId);

  return useMutation({
    mutationFn: ({ userId, following }: { userId: number; following: boolean }) =>
      following ? unfollowUser(userId) : followUser(userId),

    onMutate: async ({ userId, following }) => {
      await queryClient.cancelQueries({ queryKey: fKey });
      await queryClient.cancelQueries({ queryKey: gKey });

      const prevFollowers = queryClient.getQueryData<FollowUser[]>(fKey);
      const prevFollowings = queryClient.getQueryData<FollowUser[]>(gKey);

      const toggle = (list: FollowUser[] | undefined) =>
        list?.map((u) => (u.userId === userId ? { ...u, following: !following } : u));

      queryClient.setQueryData(fKey, toggle(prevFollowers));
      queryClient.setQueryData(gKey, toggle(prevFollowings));

      return { prevFollowers, prevFollowings };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevFollowers !== undefined) {
        queryClient.setQueryData(fKey, context.prevFollowers);
      }
      if (context?.prevFollowings !== undefined) {
        queryClient.setQueryData(gKey, context.prevFollowings);
      }
    },
  });
};
