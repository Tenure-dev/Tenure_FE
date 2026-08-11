import { useMutation } from '@tanstack/react-query';
import { createManualOotd } from './ootd';

// 태그 작성 진입 시: 이미지로 임시 비공개(ARCHIVED) OOTD 생성 → ootdId 반환.
// 이후 태그 작성(analyze) → batch → confirm으로 공개(ACTIVE) 전환한다.
export const useCreateManualOotd = () =>
  useMutation({
    mutationFn: async (image: File) => {
      const res = await createManualOotd(image);
      return res.ootdId;
    },
  });
