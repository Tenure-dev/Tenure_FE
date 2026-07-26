import type { SearchAccount, SearchFilters, SearchResultItem, SortOption } from '../model/types';

export const filterSearchItems = (
  items: SearchResultItem[],
  keyword: string,
  filters: SearchFilters,
): SearchResultItem[] => {
  const trimmedKeyword = keyword.trim();

  return items.filter((item) => {
    if (trimmedKeyword) {
      const matchesKeyword = item.keywords.some((k) => k.includes(trimmedKeyword));
      if (!matchesKeyword) return false;
    }

    if (filters.saleStatus === 'onSaleOnly' && item.saleStatus !== 'onSale') return false;
    if (filters.saleStatus === 'onSaleIncluded' && item.saleStatus === 'unlisted') return false;

    if (filters.gender !== 'all' && item.gender !== 'unisex' && item.gender !== filters.gender) {
      return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false;
    }

    if (item.authorHeight < filters.heightRange[0] || item.authorHeight > filters.heightRange[1]) {
      return false;
    }

    if (item.authorWeight < filters.weightRange[0] || item.authorWeight > filters.weightRange[1]) {
      return false;
    }

    return true;
  });
};

export const sortSearchItems = (
  items: SearchResultItem[],
  sort: SortOption,
): SearchResultItem[] => {
  const sorted = [...items];

  switch (sort) {
    case 'latest':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    case 'like':
      return sorted.sort((a, b) => b.likeCount - a.likeCount);
    case 'view':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'save':
      return sorted.sort((a, b) => b.saveCount - a.saveCount);
    case 'recommend':
    default:
      return sorted;
  }
};

export const filterAccounts = (accounts: SearchAccount[], keyword: string): SearchAccount[] => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return accounts;
  return accounts.filter((account) => account.name.includes(trimmedKeyword));
};
