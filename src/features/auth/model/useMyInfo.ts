import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../api/userApi';

export const USER_ME_QUERY_KEY = ['users', 'me'] as const;

export const useMyInfo = (enabled = true) =>
  useQuery({ queryKey: USER_ME_QUERY_KEY, queryFn: getMyInfo, enabled });
