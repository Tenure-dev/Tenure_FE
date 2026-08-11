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

export interface AddressCreatePayload {
  receiverName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode?: string;
  requestNote?: string;
  isDefault: boolean;
}

// BE: PATCH /addresses/{addressId}는 보낸 필드만 수정하는 부분 업데이트다.
export type AddressUpdatePayload = Partial<AddressCreatePayload>;

export const getAddresses = () => api.get<Address[]>('/addresses');

export const createAddress = (payload: AddressCreatePayload) =>
  api.post<Address>('/addresses', payload);

export const updateAddress = (addressId: number, payload: AddressUpdatePayload) =>
  api.patch<Address>(`/addresses/${addressId}`, payload);

export const deleteAddress = (addressId: number) => api.delete<void>(`/addresses/${addressId}`);
