import { create } from 'zustand';
import { profile as mockProfile } from '@/pages/mypage/mock';

export type Gender = 'male' | 'female';

interface ProfileState {
  name: string;
  gender: Gender;
  height: number;
  weight: number;
  photoUrl: string | null;
  setProfile: (patch: Partial<Omit<ProfileState, 'setProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  name: mockProfile.name,
  gender: mockProfile.gender,
  height: mockProfile.height,
  weight: mockProfile.weight,
  photoUrl: null,
  setProfile: (patch) => set(patch),
}));
