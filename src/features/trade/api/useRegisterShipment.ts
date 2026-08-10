import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerShipment } from './tradeApi';
import type { DeliveryCarrier } from './types';

export const useRegisterShipment = (tradeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      deliveryCarrier: DeliveryCarrier;
      trackingNumber: string;
      customDeliveryCarrierName?: string;
    }) => registerShipment(tradeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', tradeId] });
    },
  });
};
