import { useQuery } from '@tanstack/react-query';
import { getFrequentlyWornTogether } from '../api/itemsApi';

export const useFrequentlyWornQuery = (itemId: number) => {
  return useQuery({
    queryKey: ['items', itemId, 'frequently-worn-together'] as const,
    queryFn: () => getFrequentlyWornTogether(itemId),
  });
};
