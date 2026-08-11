import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAddress } from '../api/addressApi';

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
