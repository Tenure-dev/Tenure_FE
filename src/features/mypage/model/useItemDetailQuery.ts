import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '../api/itemsApi';

export const useItemDetailQuery = (itemId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['items', itemId] as const,
    queryFn: () => getItemDetail(itemId),
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
  });
};
