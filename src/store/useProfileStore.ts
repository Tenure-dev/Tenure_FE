import { create } from 'zustand';

export type Gender = 'male' | 'female';

interface ProfileState {
  name: string;
  gender: Gender;
  height: number;
  weight: number;
  photoUrl: string | null;
  setProfile: (patch: Partial<Omit<ProfileState, 'setProfile'>>) => void;
}

// 초기값은 로딩 전 플레이스홀더. 실제 값은 useMyPage 응답으로 setProfile 주입된다.
export const useProfileStore = create<ProfileState>((set) => ({
  name: '',
  gender: 'female',
  height: 0,
  weight: 0,
  photoUrl: null,
  setProfile: (patch) => set(patch),
}));
