import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '../api/addressApi';

export const useAddresses = () => {
  const { data = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  });

  // 일단 기본 배송지만 리턴하게 함.
  const defaultAddress = data.find((a) => a.isDefault) ?? data[0] ?? null;
  return { defaultAddress };
};
