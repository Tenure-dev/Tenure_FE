import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAddress, type AddressUpdatePayload } from '../api/addressApi';

export const useUpdateAddress = (addressId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressUpdatePayload) => updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
