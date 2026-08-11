import type { CategoryResponse } from '../api/types';

export interface CategoryGroup {
  id: number;
  name: string;
  items: CategoryResponse[];
}

// 필터에 보여줄 대분류 순서. BE의 sort_order와는 무관하게 필터 UI 전용으로 고정한다.
// '미분류'(간편 등록 placeholder 카테고리)는 사용자가 고를 대상이 아니라 필터에서 제외한다.
const CATEGORY_ORDER = [
  '아우터',
  '상의',
  '하의',
  '신발',
  '가방',
  '모자',
  '치마',
  '원피스',
  '액세서리',
  '주얼리',
];

// BE 카테고리는 depth 1(부모)과 depth 2(자식)로만 구성되어 있어 parentId 유무로 나눈다.
export const groupCategories = (categories: CategoryResponse[]): CategoryGroup[] =>
  categories
    .filter((category) => category.parentId === null && category.name !== '미분류')
    .map((parent) => ({
      id: parent.id,
      name: parent.name,
      items: categories.filter((category) => category.parentId === parent.id),
    }))
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.name);
      const bi = CATEGORY_ORDER.indexOf(b.name);
      return (ai === -1 ? CATEGORY_ORDER.length : ai) - (bi === -1 ? CATEGORY_ORDER.length : bi);
    });
