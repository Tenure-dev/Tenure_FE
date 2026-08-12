import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTagsBatch, confirmTags } from './ootdApi';
import type { OotdTagInput } from './dto';

// 게시 확정: 로컬에 모아둔 태그를 batch로 일괄 등록 → confirm으로 공개(ACTIVE) 전환.
// ootdId는 태그 작성 진입 시 manual-tag로 미리 생성해 둔 값을 사용한다.
export const usePublishOotd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ootdId, tags }: { ootdId: number; tags: OotdTagInput[] }) => {
      await createTagsBatch(ootdId, { tags });
      await confirmTags(ootdId);
      return ootdId;
    },
    // 공개 전환 후 목록 캐시 무효화 → 마이페이지·피드에 새 글 즉시 반영
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ootds'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
