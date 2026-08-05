import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAddress } from '../api/addressApi';

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
