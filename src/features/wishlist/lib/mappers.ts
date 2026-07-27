import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import type { WishListItemDto } from '../api/dto';
import type { WishlistItem } from '../model/types';

export const toWishlistItem = (dto: WishListItemDto): WishlistItem => ({
  wishId: dto.wishId,
  itemId: dto.itemId,
  brand: dto.brandName,
  name: dto.itemName,
  price: dto.price,
  imageUrl: resolveFileUrl(dto.representativeImageUrl),
  saleStatus: dto.saleStatus,
  purchaseOfferEnabled: dto.purchaseOfferEnabled,
  notifyEnabled: dto.notificationEnabled,
});
