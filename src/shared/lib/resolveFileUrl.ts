// 서버가 주는 상대경로(/files/...)를 API 베이스 기준 절대경로로 바꾼다.
// 이미 절대 URL(http/https)이면 그대로 둔다.
// 배포 시 VITE_API_BASE_URL만 실제 서버 주소로 바꾸면 이미지도 그 주소를 따라간다.
const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const resolveFileUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path}`;
};
