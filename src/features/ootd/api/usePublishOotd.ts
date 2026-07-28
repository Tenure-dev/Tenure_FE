import { useMutation } from '@tanstack/react-query';
import { createOotd, createTagsBatch } from './ootd';
import type { OotdTagInput } from './dto';

// 게시: POST /ootds(이미지)로 ootdId 받고 → 태그 있으면 POST /ootds/{ootdId}/tags/batch로 일괄 등록.
// 두 호출을 하나의 뮤테이션으로 묶어 성공 시 ootdId를 반환한다.
export const usePublishOotd = () =>
  useMutation({
    mutationFn: async ({ image, tags }: { image: File; tags: OotdTagInput[] }) => {
      const res = await createOotd(image);
      if (tags.length > 0) {
        await createTagsBatch(res.ootdId, tags);
      }
      return res.ootdId;
    },
  });
