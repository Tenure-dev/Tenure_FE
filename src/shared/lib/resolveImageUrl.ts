const API_ORIGIN = new URL(import.meta.env.VITE_API_BASE_URL).origin;

// BE는 업로드된 이미지를 절대 URL이 아닌 "/files/..." 같은 서버 상대경로로 내려준다.
// FE 개발 서버는 BE와 오리진이 달라 상대경로를 그대로 쓰면 이미지가 깨지므로 BE 오리진을 붙여준다.
export function resolveImageUrl(url: string): string;
export function resolveImageUrl(url: string | null): string | null;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}
