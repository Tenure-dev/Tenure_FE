import { useQuery } from '@tanstack/react-query';
import { getHeartedOotds, getMyPosts, getSavedOotds } from './feed';

/** 마이페이지 피드 탭 */
export type FeedTab = '게시물' | '좋아요' | '저장';

export const FEED_TABS: FeedTab[] = ['게시물', '좋아요', '저장'];

/** 게시물 탭: 내 OOTD 목록 */
export const useMyPosts = (enabled = true) =>
  useQuery({
    queryKey: ['ootds', 'me'],
    queryFn: getMyPosts,
    enabled,
    staleTime: 60_000,
  });

/** 좋아요·저장 탭: 반응한 OOTD 목록 */
export const useReactedOotds = (tab: '좋아요' | '저장', enabled = true) =>
  useQuery({
    queryKey: ['ootds', tab === '좋아요' ? 'hearted' : 'saved'],
    queryFn: tab === '좋아요' ? getHeartedOotds : getSavedOotds,
    enabled,
    staleTime: 60_000,
  });
