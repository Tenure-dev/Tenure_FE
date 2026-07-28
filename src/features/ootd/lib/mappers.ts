import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import type { ItemListResponse, OotdDetailResponse, TagInfoResponse } from '../api/types';
import type { ClosetItem, ItemStatus, OotdPost, TaggedItem } from '../model/types';

const toItemStatus = (tag: TagInfoResponse): ItemStatus => {
  if (tag.itemStatus === 'ARCHIVED') return '삭제됨';
  if (tag.itemStatus === 'SOLD' || tag.itemStatus === 'TRANSFERRED') return '판매완료';
  if (tag.itemStatus === 'ON_SALE' && tag.onSale) return '판매중';
  return tag.purchaseOfferEnabled ? '미판매_제안가능' : '미판매_제안불가';
};

export const toTaggedItem = (tag: TagInfoResponse): TaggedItem => ({
  id: tag.tagId,
  itemId: tag.itemId,
  brand: tag.item.brandName,
  name: tag.item.itemName,
  category: tag.item.categorySmall,
  status: toItemStatus(tag),
  price: tag.price ?? undefined,
  imageUrl: resolveImageUrl(tag.item.representativeImageUrl) ?? undefined,
  wished: tag.wished,
  position: {
    x: (tag.bboxX + tag.bboxWidth / 2) * 100,
    y: (tag.bboxY + tag.bboxHeight / 2) * 100,
  },
  bbox: { x: tag.bboxX, y: tag.bboxY, width: tag.bboxWidth, height: tag.bboxHeight },
});

export const toOotdPost = (
  detail: OotdDetailResponse,
  currentUserId: number | null,
  prev?: Pick<OotdPost, 'isBlocked'>,
): OotdPost => ({
  id: detail.ootdId,
  imageUrl: resolveImageUrl(detail.imageUrl),
  author: {
    id: detail.author.userId,
    name: detail.author.username,
    avatarUrl: resolveImageUrl(detail.author.profileImageUrl),
    followerCount: detail.author.followerCount,
    feedCount: detail.author.feedCount,
  },
  likeCount: detail.heartCount,
  bookmarkCount: detail.saveCount,
  liked: detail.hearted,
  bookmarked: detail.saved,
  isOwner: currentUserId !== null && currentUserId === detail.author.userId,
  isFollowing: detail.author.following,
  isBlocked: prev?.isBlocked ?? false,
  taggedItems: detail.tags.map(toTaggedItem),
});

const daysAgo = (dateStr: string | null): number | null => {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

export const toClosetItem = (item: ItemListResponse): ClosetItem => ({
  id: item.itemId,
  brand: item.brandName,
  name: item.itemName,
  imageUrl: resolveImageUrl(item.representativeImageUrl),
  lastWornDaysAgo: daysAgo(item.lastWornAt),
  verifiedCount: item.ootdVerifiedWearCount,
  purchaseOfferEnabled: item.purchaseOfferEnabled,
});
