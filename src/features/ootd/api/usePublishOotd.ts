import { useMutation } from '@tanstack/react-query';
import { createOotd } from './ootd';
import type { OotdTagInput } from './dto';

// 게시: POST /ootds에 이미지 + (선택)태그를 한 번에 전송. 성공 시 ootdId를 반환한다.
export const usePublishOotd = () =>
  useMutation({
    mutationFn: async ({ image, tags }: { image: File; tags: OotdTagInput[] }) => {
      const res = await createOotd(image, tags);
      return res.ootdId;
    },
  });
