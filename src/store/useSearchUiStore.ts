import { create } from 'zustand';

interface SearchUiState {
  inputActive: boolean;
  setInputActive: (inputActive: boolean) => void;
}

// 검색 홈(SearchHomePage)의 입력창 포커스 상태를 BottomNavBar(shared 컴포넌트)에서도
// 알아야 해서 store로 뺐다. 같은 경로(/search) 안에서 오버레이만 바뀌는 상태라
// RootLayout의 경로 기반 hide 로직으로는 구분이 안 된다.
export const useSearchUiStore = create<SearchUiState>((set) => ({
  inputActive: false,
  setInputActive: (inputActive) => set({ inputActive }),
}));
