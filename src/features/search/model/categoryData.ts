import type { CategoryResponse } from '../api/types';

export interface CategoryGroup {
  id: number;
  name: string;
  items: CategoryResponse[];
}

// BE 카테고리는 depth 1(부모)과 depth 2(자식)로만 구성되어 있어 parentId 유무로 나눈다.
export const groupCategories = (categories: CategoryResponse[]): CategoryGroup[] =>
  categories
    .filter((category) => category.parentId === null)
    .map((parent) => ({
      id: parent.id,
      name: parent.name,
      items: categories.filter((category) => category.parentId === parent.id),
    }));
