import { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryApi';
import type { CategoryResponse } from '../api/types';

// 카테고리는 자주 바뀌지 않으므로 세션 동안 한 번만 불러와 여러 컴포넌트가 공유한다.
let categoriesCache: Promise<CategoryResponse[]> | null = null;
const fetchCategoriesOnce = () => {
  if (!categoriesCache) categoriesCache = getCategories();
  return categoriesCache;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesOnce().then((data) => {
      if (!cancelled) setCategories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
};
