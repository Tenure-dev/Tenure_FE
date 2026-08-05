import { useQuery } from '@tanstack/react-query';
import { getHistoryOotds } from '../api/itemsApi';

export const useHistoryOotdsQuery = (
  itemId: number,
  historyId: number,
  params?: { page?: number; size?: number },
) =>
  useQuery({
    queryKey: ['items', itemId, 'histories', historyId, 'ootds', params],
    queryFn: () => getHistoryOotds(itemId, historyId, params),
  });
