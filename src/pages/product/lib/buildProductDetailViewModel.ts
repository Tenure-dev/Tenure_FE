import type { ProductDetailResponse } from '@/features/product/api/dto';
import type { ViewerRole, ProductSaleStatus, ItemSeller } from '@/features/product/model/types';
import { getMeasurementSection } from '@/features/product/lib/measurementUtils';
import { PRODUCT_STATUS_MAP, CONDITION_LABELS } from '@/features/product/lib/productAdapters';
import type { ItemDetailResponse, HistoryOotdsResponse } from '@/features/mypage/model/items';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

export type ProductDetailViewModel = {
  role: ViewerRole;
  saleStatus: ProductSaleStatus;
  brandName: string;
  itemName: string;
  price: number | undefined;
  imageUrl: string;
  tenureRecord: {
    interestCount: number;
    ootdVerifiedCount: number;
    lastWornDate: string;
    size: string;
    wornFor: string;
    category: string;
    firstOwnedDate: string;
  };
  offerAvailable: boolean;
  conditionChecks: { label: string; checked: boolean }[] | undefined;
  measurementSection: ReturnType<typeof getMeasurementSection>;
  seller: ItemSeller | undefined;
  sellerDescription: string | null;
  ootdItems: { id: string; imageUrl: string }[];
};

type BuildParams = {
  isItemMode: boolean;
  itemData: ItemDetailResponse | undefined;
  productData: ProductDetailResponse | undefined;
  taggedOotdsData: HistoryOotdsResponse | undefined;
  currentUserId: number | undefined;
};

export function buildProductDetailViewModel({
  isItemMode,
  itemData,
  productData,
  taggedOotdsData,
  currentUserId,
}: BuildParams): ProductDetailViewModel {
  if (isItemMode) {
    const item = itemData!;
    return {
      role: item.ownerUserId === currentUserId ? 'seller' : 'buyer',
      saleStatus: 'hidden',
      brandName: item.brandName,
      itemName: item.itemName,
      price: undefined,
      imageUrl: resolveImageUrl(item.representativeImageUrl),
      tenureRecord: {
        interestCount: item.wishCount,
        ootdVerifiedCount: item.ootdVerifiedWearCount,
        lastWornDate: item.lastWornAt ?? '-',
        size: `${item.sizeSystem} ${item.sizeValue}`,
        wornFor: '-',
        category: item.categorySmall,
        firstOwnedDate: item.firstOwnedAt ?? '-',
      },
      offerAvailable: item.purchaseOfferEnabled,
      conditionChecks: undefined,
      measurementSection: null,
      seller: undefined,
      sellerDescription: null,
      ootdItems: (taggedOotdsData?.content ?? []).map((ootd) => ({
        id: String(ootd.ootdId),
        imageUrl: resolveImageUrl(ootd.imageUrl),
      })),
    };
  }

  const product = productData!;
  return {
    role: product.viewerMode === 'SELLER' ? 'seller' : 'buyer',
    saleStatus: PRODUCT_STATUS_MAP[product.productStatus],
    brandName: product.item.brandName,
    itemName: product.item.itemName,
    price: product.price ?? undefined,
    imageUrl: resolveImageUrl(product.mainImageUrl),
    tenureRecord: {
      interestCount: product.item.wishCount,
      ootdVerifiedCount: product.item.ootdVerifiedWearCount,
      lastWornDate: '-',
      size: `${product.item.sizeSystem} ${product.item.sizeValue}`,
      wornFor: '-',
      category: product.item.categorySmall,
      firstOwnedDate: '-',
    },
    offerAvailable: product.availableActions.includes('OFFER'),
    conditionChecks: product.conditionFlags
      ? (Object.entries(product.conditionFlags) as [string, boolean][]).map(([key, checked]) => ({
          label: CONDITION_LABELS[key] ?? key,
          checked,
        }))
      : undefined,
    measurementSection: getMeasurementSection(
      product.item.categoryLarge,
      product.measurements ?? undefined,
    ),
    seller: {
      id: String(product.seller.userId),
      nickname: product.seller.username,
      followerCount: 0,
      avatarUrl: resolveImageUrl(product.seller.profileImageUrl) ?? undefined,
      grade: product.seller.grade,
    },
    sellerDescription: product.sellerDescription,
    ootdItems: product.representativeOotds.map((ootd) => ({
      id: String(ootd.ootdId),
      imageUrl: resolveImageUrl(ootd.imageUrl),
    })),
  };
}
