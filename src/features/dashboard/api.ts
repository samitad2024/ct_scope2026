import { apiClient } from '../../services/api/api-client';
import { ApiResponse, DashboardStats, ScopedIssuesResponse } from '../../types/api';

/**
 * Dashboard API services
 */

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiClient.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
};

export const getPendingIssues = async (params: { category?: string; page?: number; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  return apiClient.get<ScopedIssuesResponse>(`/api/admin/scoped-issues/pending?${queryParams.toString()}`);
};
