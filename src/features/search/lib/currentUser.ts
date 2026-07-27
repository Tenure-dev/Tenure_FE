import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';

// BE의 인기 사용자/유저 검색 쿼리가 현재 로그인한 사용자 본인을 결과에서 제외하지 않아
// (UserRepository.findPopularUsers, searchUsers 모두 currentUserId 제외 조건 없음),
// 화면에 자기 자신이 "팔로우" 버튼과 함께 뜨는 것을 막기 위해 FE에서 걸러낸다.
export const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isNaN(id) ? null : id;
};
