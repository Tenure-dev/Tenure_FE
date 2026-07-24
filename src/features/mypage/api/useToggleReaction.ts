import { useMutation } from '@tanstack/react-query';
import { heartOotd, saveOotd, unheartOotd, unsaveOotd } from './reaction';

type ToggleArgs = { ootdId: number; active: boolean }; // active=true → 등록, false → 취소

/**
 * 게시물 탭 임시 토글용.
 * 서버에 hearted/saved 플래그가 없어 초기 상태를 모르므로, 현재는 로컬 상태 기준으로 POST/DELETE만 호출한다.
 * (백엔드가 GET /ootds/me 에 hearted/saved 를 추가하면 제대로 된 토글로 교체 예정)
 */
export const useToggleHeart = () =>
  useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? heartOotd(ootdId) : unheartOotd(ootdId),
  });

export const useToggleSave = () =>
  useMutation({
    mutationFn: ({ ootdId, active }: ToggleArgs) =>
      active ? saveOotd(ootdId) : unsaveOotd(ootdId),
  });
