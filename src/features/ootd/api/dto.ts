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

export interface SimilarItemResponse {
  itemId: number;
  brandName: string;
  itemName: string;
  representativeImageUrl: string | null;
  categoryId: number;
  categoryName: string;
}
