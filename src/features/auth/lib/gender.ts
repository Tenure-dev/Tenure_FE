import type { ApiGender } from '../api/types';

export type LocalGender = 'male' | 'female';

export const toApiGender = (gender: LocalGender): ApiGender =>
  gender === 'male' ? 'MALE' : 'FEMALE';

export const fromApiGender = (gender: ApiGender): LocalGender =>
  gender === 'MALE' ? 'male' : 'female';
