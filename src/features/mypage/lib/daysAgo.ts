export const getDaysAgo = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
