import { useQuery } from '@tanstack/react-query';
import { getItemHistories } from '../api/itemsApi';

export const useItemHistoryQuery = (itemId: number) =>
  useQuery({
    queryKey: ['items', itemId, 'histories'],
    queryFn: () => getItemHistories(itemId),
  });
