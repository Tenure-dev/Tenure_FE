import { useQuery } from '@tanstack/react-query';
import { getHasUnreadNotifications } from './notifications';

// 실패/로딩 중엔 data가 undefined → 헤더에서 inactive로 처리(안전).
export const useHasUnreadNotifications = () =>
  useQuery({
    queryKey: ['notifications', 'has-unread'],
    queryFn: getHasUnreadNotifications,
    staleTime: 30_000,
  });
