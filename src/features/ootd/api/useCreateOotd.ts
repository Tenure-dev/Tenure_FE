import { useMutation } from '@tanstack/react-query';
import { createOotd } from './ootd';

export const useCreateOotd = () => useMutation({ mutationFn: (image: File) => createOotd(image) });
