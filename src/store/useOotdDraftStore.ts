import { create } from 'zustand';

interface OotdDraftState {
  photo: string | null;
  ootdId: number | null;
  setDraft: (photo: string, ootdId: number) => void;
  clear: () => void;
}

// 태그 작성 중인 임시(ARCHIVED) OOTD. 같은 사진으로 재진입 시 ootdId를 재사용해 중복 생성을 막는다.
// 게시(confirm) 완료 시 clear로 비운다.
export const useOotdDraftStore = create<OotdDraftState>((set) => ({
  photo: null,
  ootdId: null,
  setDraft: (photo, ootdId) => set({ photo, ootdId }),
  clear: () => set({ photo: null, ootdId: null }),
}));
