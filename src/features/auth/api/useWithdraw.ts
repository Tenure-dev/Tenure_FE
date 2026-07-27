import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clearAuthStorage } from '@/shared/lib/api';
import { withdrawUser } from './userApi';
import type { WithdrawalRequest } from './types';

export const useWithdraw = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: WithdrawalRequest) => withdrawUser(payload),
    onSuccess: () => {
      clearAuthStorage();
      navigate('/login');
    },
  });
};
