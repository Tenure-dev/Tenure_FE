import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getFeed } from '@/features/feed/api/feedApi';
import { getChatList } from '@/features/chat/api/chatList';
import { getMyPage } from '@/features/mypage/api/mypage';
import { getMyPosts } from '@/features/mypage/api/feed';
import { getSearchHome } from '@/features/search/api/searchApi';

const AppLoadingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    Promise.all([
      queryClient.prefetchInfiniteQuery({
        queryKey: ['feed', undefined],
        queryFn: ({ pageParam }) =>
          getFeed({
            cursorCreatedAt: pageParam?.cursorCreatedAt ?? undefined,
            cursorId: pageParam?.cursorId ?? undefined,
          }),
        initialPageParam: undefined as
          { cursorCreatedAt?: string | null; cursorId?: number | null } | undefined,
      }),
      queryClient.prefetchInfiniteQuery({
        queryKey: ['chats', 'ALL'],
        queryFn: ({ pageParam }) => getChatList('ALL', pageParam),
        initialPageParam: undefined,
      }),
      queryClient.prefetchQuery({ queryKey: ['my-page'], queryFn: getMyPage }),
      queryClient.prefetchQuery({ queryKey: ['ootds', 'me'], queryFn: getMyPosts }),
      queryClient.prefetchQuery({ queryKey: ['search', 'home'], queryFn: getSearchHome }),
    ]).finally(() => navigate('/feed', { replace: true }));
  }, [navigate, queryClient]);

  return (
    <div className="bg-bg-white flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="border-gray-bg border-t-brand size-12 animate-spin rounded-full border-4" />
      <p className="text-body-2 text-text-secondary">데이터 불러오는 중...</p>
    </div>
  );
};

export default AppLoadingPage;
