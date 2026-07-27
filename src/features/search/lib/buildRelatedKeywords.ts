export const buildRelatedKeywords = (query: string, suggestions: string[]) => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const matches = suggestions.filter((k) => k.includes(trimmed) && k !== trimmed);
  return [trimmed, ...matches].slice(0, 8);
};
