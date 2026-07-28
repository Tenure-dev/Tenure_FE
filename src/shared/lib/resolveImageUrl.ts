// 배포: 절대 URL → origin 추출 / 로컬: '/api-proxy' 같은 상대경로 → 그대로 프리픽스(dev 프록시가 중계)
const RAW = import.meta.env.VITE_API_BASE_URL ?? '';
const API_ORIGIN = /^https?:\/\//.test(RAW) ? new URL(RAW).origin : RAW;

export function resolveImageUrl(url: string): string;
export function resolveImageUrl(url: string | null): string | null;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}
