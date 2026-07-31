export type ViewerMode = 'BUYER' | 'SELLER';
export type AvailableAction = 'PURCHASE' | 'OFFER' | 'CHAT';
export type FeePolicy = 'SELLER_PAYS' | 'BUYER_PAYS' | 'SPLIT';
export type WearingTarget = 'MALE' | 'FEMALE' | 'UNISEX';
export type SellerGrade = 'BASIC' | 'RECORD';

export type ProductStatus = 'ON_SALE' | 'TRADING' | 'SOLD' | 'HIDDEN';
export type ItemStatus = 'OWNED' | 'ON_SALE' | 'SOLD' | 'TRANSFERRED' | 'ARCHIVED';

export interface DeleteProductResponse {
  productId: number;
  itemId: number;
  productStatus: ProductStatus;
  itemStatus: ItemStatus;
}

export interface CompleteExternalResponse {
  productId: number;
  itemId: number;
  productStatus: ProductStatus;
  itemStatus: ItemStatus;
  canceledIntentCount: number;
  canceledOfferCount: number;
}

export interface UpdateProductRequest {
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  wearingTarget: WearingTarget;
  sizeSystem: string;
  sizeValue: string;
  firstOwnedAt?: string;
  representativeImageUrl?: string;
  price: number;
  shippingFee: number;
  feePolicy: FeePolicy;
  mainImageUrl?: string;
  measurements?: {
    shoulderWidth?: number;
    chestWidth?: number;
    sleeveLength?: number;
    totalLength?: number;
    waistWidth?: number;
    thighWidth?: number;
    rise?: number;
    inseam?: number;
    hemWidth?: number;
    hipWidth?: number;
  };
  conditionFlags?: {
    stain: boolean;
    tear: boolean;
    pillingOrDiscoloration: boolean;
    repairHistory: boolean;
    missingComponents: boolean;
  };
  sellerDescription?: string;
  attachedOotdIds: number[];
}

export interface UpdateProductResponse {
  productId: number;
  productStatus: ProductStatus;
}

export interface ProductDetailResponse {
  productId: number;
  viewerMode: ViewerMode;
  availableActions: AvailableAction[];
  productStatus: ProductStatus;
  item: {
    itemId: number;
    brandName: string;
    itemName: string;
    sizeSystem: string;
    sizeValue: string;
    categoryLarge: string;
    categorySmall: string;
    ootdVerifiedWearCount: number;
    wishCount: number;
  };
  seller: {
    userId: number;
    username: string;
    profileImageUrl: string | null;
    grade: SellerGrade;
  };
  price: number | null;
  shippingFee: number;
  feePolicy: FeePolicy;
  mainImageUrl: string;
  measurements: {
    shoulderWidth?: number;
    chestWidth?: number;
    sleeveLength?: number;
    totalLength?: number;
    waistWidth?: number;
    thighWidth?: number;
    rise?: number;
    inseam?: number;
    hemWidth?: number;
    hipWidth?: number;
  } | null;
  conditionFlags: {
    stain: boolean;
    tear: boolean;
    pillingOrDiscoloration: boolean;
    repairHistory: boolean;
    missingComponents: boolean;
  } | null;
  sellerDescription: string | null;
  representativeOotds: {
    ootdId: number;
    imageUrl: string;
    createdAt: string;
  }[];
}
