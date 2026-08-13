import type { Measurements } from '@/features/product/model/types';

export type MeasurementKey = keyof Measurements;
export type FormMeasurements = Partial<Record<MeasurementKey, string>>;

export type WearingTarget = 'MENSWEAR' | 'WOMENSWEAR' | 'UNISEX';
export const WEARING_TARGET_LABELS: Record<WearingTarget, string> = {
  MENSWEAR: '남성복',
  WOMENSWEAR: '여성복',
  UNISEX: '공용',
};

export type FeePolicy = 'SELLER_PAYS' | 'BUYER_PAYS' | 'SPLIT';
export const FEE_POLICY_LABELS: Record<FeePolicy, string> = {
  SELLER_PAYS: '판매자 부담',
  BUYER_PAYS: '구매자 부담',
  SPLIT: '반반 부담',
};

export type SectionKey = 'category' | 'subCategory' | 'size';

export type FormConditionFlags = {
  stain: boolean;
  tear: boolean;
  pillingOrDiscoloration: boolean;
  repairHistory: boolean;
  missingComponents: boolean;
};

export const CONDITION_FLAG_LABELS: Record<keyof FormConditionFlags, string> = {
  stain: '오염 있음',
  tear: '찢어짐 있음',
  pillingOrDiscoloration: '보풀/변색 있음',
  repairHistory: '수선 이력 있음',
  missingComponents: '구성품 누락 있음',
};

export type SaleForm = {
  mainImageUrl: string;
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  sizeSystem: string;
  sizeValue: string;
  wearingTarget: WearingTarget | '';
  feePolicy: FeePolicy | '';
  shippingFee: string;
  price: string;
  attachedOotdIds: number[];
  measurements: FormMeasurements;
  conditionFlags: FormConditionFlags;
  sellerDescription: string;
};

export const DEFAULT_CONDITION_FLAGS: FormConditionFlags = {
  stain: false,
  tear: false,
  pillingOrDiscoloration: false,
  repairHistory: false,
  missingComponents: false,
};
