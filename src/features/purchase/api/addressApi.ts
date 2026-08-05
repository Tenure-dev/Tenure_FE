import { api } from '@/shared/lib/api';

export type Address = {
  addressId: number;
  receiverName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  requestNote: string;
  isDefault: boolean;
};

export const getAddresses = () => api.get<Address[]>('/addresses');
