import { create } from 'zustand';

interface AuthState {
  currentUserId: string;
}

// 실제 로그인 연동 전까지 고정 mock 사용자
export const useAuthStore = create<AuthState>(() => ({
  currentUserId: 'me-1',
}));
