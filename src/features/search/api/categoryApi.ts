import { api } from '@/shared/lib/api';
import type { CategoryResponse } from './types';

export const getCategories = (): Promise<CategoryResponse[]> => api.get('/categories');
