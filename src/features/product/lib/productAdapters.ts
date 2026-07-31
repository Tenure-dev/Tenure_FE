import type { ProductSaleStatus } from '../model/types';
import type { ProductStatus } from '../api/dto';

export const PRODUCT_STATUS_MAP: Record<ProductStatus, ProductSaleStatus> = {
  ON_SALE: 'onSale',
  TRADING: 'trading',
  SOLD: 'sold',
  HIDDEN: 'hidden',
};

export const CONDITION_LABELS: Record<string, string> = {
  stain: '오염 있음',
  tear: '찢어짐 있음',
  pillingOrDiscoloration: '보풀/변색 있음',
  repairHistory: '수선 이력 있음',
  missingComponents: '구성품 누락 있음',
};
