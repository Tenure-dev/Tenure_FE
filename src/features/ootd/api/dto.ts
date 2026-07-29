import type { Bbox } from '../model/item';

export type OotdSource = 'CAMERA';
export type OotdTagStatus = 'ANALYZING' | 'AUTO_UNCONFIRMED' | 'CONFIRMED';
export type OotdPublicationStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface OotdCreateResponse {
  ootdId: number;
  ownerId: number;
  imageUrl: string;
  source: OotdSource;
  tagStatus: OotdTagStatus;
  publicationStatus: OotdPublicationStatus;
  createdAt: string;
}

// POST /ootds/{ootdId}/tags/batch 요청 항목 (status는 서버가 CONFIRMED로 고정)
export interface OotdTagInput {
  itemId: number;
  bbox: Bbox;
  labelText: string;
}

export interface SimilarItemResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string | null;
  categoryId: number;
  categoryName: string;
}
