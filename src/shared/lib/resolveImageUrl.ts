const API_ORIGIN = new URL(import.meta.env.VITE_API_BASE_URL).origin;

export function resolveImageUrl(url: string): string;
export function resolveImageUrl(url: string | null): string | null;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}
