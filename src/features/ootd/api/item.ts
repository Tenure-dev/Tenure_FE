import { api } from '@/shared/lib/api';
import type { WearTarget } from '../model/item';

export type WearingTarget = 'MENSWEAR' | 'WOMENSWEAR' | 'UNISEX';

// 폼의 한글 착용대상 → 서버 enum
const WEAR_TARGET_MAP: Record<WearTarget, WearingTarget> = {
  남성복: 'MENSWEAR',
  여성복: 'WOMENSWEAR',
  공용: 'UNISEX',
};
export const toWearingTarget = (t: WearTarget): WearingTarget => WEAR_TARGET_MAP[t];

export interface TagDraftItemRequest {
  brandName: string;
  itemName: string;
  wearingTarget: WearingTarget;
  firstOwnedAt?: string; // 'YYYY-MM-DD'
}

export interface TagDraftItemResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  wearingTarget: WearingTarget;
  firstOwnedAt: string | null;
  categoryId: number;
}

// 태그 작성용 간편 아이템 등록 (카테고리는 백엔드가 자동 분류)
export const createTagDraftItem = (payload: TagDraftItemRequest) =>
  api.post<TagDraftItemResponse>('/items/tag-draft', payload);
