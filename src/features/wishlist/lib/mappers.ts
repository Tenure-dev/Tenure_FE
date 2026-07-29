import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { WishListItemDto } from '../api/dto';
import type { WishlistItem } from '../model/types';

const daysAgo = (dateStr: string): number => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

export const toWishlistItem = (dto: WishListItemDto): WishlistItem => ({
  wishId: dto.wishId,
  itemId: dto.itemId,
  brand: dto.brandName,
  name: dto.itemName,
  price: dto.price,
  imageUrl: resolveFileUrl(dto.representativeImageUrl),
  saleStatus: dto.saleStatus,
  sellerUsername: dto.sellerUsername,
  wishedDaysAgo: daysAgo(dto.createdAt),
  purchaseOfferEnabled: dto.purchaseOfferEnabled,
  notifyEnabled: dto.notificationEnabled,
});
