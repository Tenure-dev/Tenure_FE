import type { ItemStatus } from '../model/items';

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  OWNED: '미판매',
  ON_SALE: '판매중',
  SOLD: '판매완료',
  TRANSFERRED: '전송중',
  ARCHIVED: '비활성화',
};
