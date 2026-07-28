import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '../api/itemsApi';

export const useItemDetailQuery = (itemId: number) => {
  return useQuery({
    queryKey: ['items', itemId] as const,
    queryFn: () => getItemDetail(itemId),
  });
};
