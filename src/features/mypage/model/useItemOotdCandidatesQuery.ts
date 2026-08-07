import { useQuery } from '@tanstack/react-query';
import { getItemOotdCandidates } from '../api/itemsApi';

export const useItemOotdCandidatesQuery = (
  itemId: number,
  params?: { page?: number; size?: number },
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ['items', itemId, 'ootds', params],
    queryFn: () => getItemOotdCandidates(itemId, params),
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
  });
