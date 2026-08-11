import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOotd } from './ootd';

// 자동태그 게시. 성공 시 목록 캐시를 무효화해 마이페이지·피드에 새 글이 바로 반영되게 한다.
export const useCreateOotd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: File) => createOotd(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ootds'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
