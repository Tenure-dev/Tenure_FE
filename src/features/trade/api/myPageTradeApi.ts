import { api } from '@/shared/lib/api';
import type {
  MyPagePurchaseResponse,
  MyPagePurchaseTab,
  MyPageSaleResponse,
  MyPageSalesTab,
  PageResponse,
} from './types';

export const getMyPurchases = (params?: {
  tab?: MyPagePurchaseTab;
  page?: number;
  size?: number;
}) => api.get<PageResponse<MyPagePurchaseResponse>>('/my-page/purchases', { params });

export const getMySales = (params?: { tab?: MyPageSalesTab; page?: number; size?: number }) =>
  api.get<PageResponse<MyPageSaleResponse>>('/my-page/sales', { params });
