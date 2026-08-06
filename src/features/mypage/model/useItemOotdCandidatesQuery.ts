import { useQuery } from '@tanstack/react-query';
import { getItemOotdCandidates } from '../api/itemsApi';

export const useItemOotdCandidatesQuery = (
  itemId: number,
  params?: { page?: number; size?: number },
) =>
  useQuery({
    queryKey: ['items', itemId, 'ootds', params],
    queryFn: () => getItemOotdCandidates(itemId, params),
  });
