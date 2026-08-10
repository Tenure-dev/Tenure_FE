import { useMutation } from '@tanstack/react-query';
import { createTagsBatch, confirmTags } from './ootdApi';
import type { OotdTagInput } from './dto';

// 게시 확정: 로컬에 모아둔 태그를 batch로 일괄 등록 → confirm으로 공개(ACTIVE) 전환.
// ootdId는 태그 작성 진입 시 manual-tag로 미리 생성해 둔 값을 사용한다.
export const usePublishOotd = () =>
  useMutation({
    mutationFn: async ({ ootdId, tags }: { ootdId: number; tags: OotdTagInput[] }) => {
      await createTagsBatch(ootdId, { tags });
      await confirmTags(ootdId);
      return ootdId;
    },
  });
