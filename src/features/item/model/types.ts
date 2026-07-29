export type ItemSaleStatus = 'onSale' | 'unsold' | 'soldOut';

export const ITEM_REPORT_REASONS = [
  '가품 또는 정품 의심',
  '상품 정보가 실제와 다름',
  '도용한 사진 또는 권리 침해',
  '사기 또는 외부 거래 유도',
  '거래 금지 품목',
  '부적절한 이미지 또는 내용',
] as const;

export type ViewerRole = 'buyer' | 'seller';

export interface ItemSeller {
  id: string;
  nickname: string;
  followerCount: number;
  avatarUrl?: string;
}

export interface ItemTenureRecord {
  interestCount: number;
  ootdVerifiedCount: number;
  lastWornDate: string;
  size: string;
  wornFor: string;
  category: string;
  firstOwnedDate: string;
}

export interface ItemMeasurementField {
  label: string;
  value: string;
}

export interface ItemConditionCheck {
  label: string;
  checked: boolean;
}

export interface RepresentativeOOTD {
  id: string;
  imageUrl: string;
}

export interface ItemDetail {
  id: string;
  sellerId: string;
  seller: ItemSeller;
  brand: string;
  name: string;
  imageUrls: string[];
  saleStatus: ItemSaleStatus;
  price?: number;
  isWished: boolean;
  description?: string;
  tenureRecord: ItemTenureRecord;
  measurementTitle?: string;
  measurements?: ItemMeasurementField[];
  conditionChecks?: ItemConditionCheck[];
  representativeOOTDs: RepresentativeOOTD[];
  /** unsold 상태에서 서버가 내려주는 구매제안 가능 여부 */
  offerAvailable?: boolean;
}
