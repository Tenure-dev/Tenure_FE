import type { ProductSaleStatus } from '../model/types';
import type { ProductStatus, SellerGrade } from '../api/dto';

export const PRODUCT_STATUS_MAP: Record<ProductStatus, ProductSaleStatus> = {
  ON_SALE: 'onSale',
  TRADING: 'trading',
  SOLD: 'sold',
  HIDDEN: 'hidden',
};

export const SELLER_GRADE_LABEL: Record<SellerGrade, string> = {
  BASIC: '기본 사용자',
  RECORD: '레코드 사용자',
};

export const CONDITION_LABELS: Record<string, string> = {
  stain: '오염 있음',
  tear: '찢어짐 있음',
  pillingOrDiscoloration: '보풀/변색 있음',
  repairHistory: '수선 이력 있음',
  missingComponents: '구성품 누락 있음',
};
