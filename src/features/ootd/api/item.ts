import { api } from '@/shared/lib/api';
import type { Bbox, WearTarget } from '../model/item';

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
  representativeImageUrl?: string;
}

export interface TagDraftItemResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  wearingTarget: WearingTarget;
  firstOwnedAt: string | null;
  categoryId: number;
}

// 태그 작성용 간편 아이템 등록. 카테고리 미지정 시 "AI 분류 대기"로 저장되고,
// 이걸 실제 카테고리로 분류해주는 로직은 아직 BE에 없음(요청 문서 참고).
export const createTagDraftItem = (payload: TagDraftItemRequest) =>
  api.post<TagDraftItemResponse>('/items/tag-draft', payload);

export interface ItemRepresentativeImageResponse {
  representativeImageUrl: string; // 백엔드가 원본 OOTD에서 생성한 3:4 대표 이미지 URL
}

// 태그 작성 중 새 아이템 등록: ootdId + bbox만 전송하면 백엔드가 저장된 원본 OOTD 이미지에서
// bbox를 포함하는 3:4 대표 이미지를 생성해 URL을 반환한다. (FE 크롭/업로드 방식 대체)
export const createItemRepresentativeImage = (ootdId: number, bbox: Bbox) =>
  api.post<ItemRepresentativeImageResponse>(`/ootds/${ootdId}/items/representative-image`, {
    bbox,
  });
