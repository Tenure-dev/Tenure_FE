import { api } from '@/shared/lib/api';
import type { FeedResponse, FeedParams } from '../model/types';

export const getFeed = (params?: FeedParams) => api.get<FeedResponse>('/feed', { params });
