import { apiClient } from './api-client';
import { ApiResponse, DashboardStats } from '../../types/api';

/**
 * Analytics and Dashboard API service integrating with real backend
 */

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiClient.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
};

export const getAnalyticsSummary = async (): Promise<DashboardStats> => {
  const response = await getDashboardStats();
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch dashboard stats');
  }
  return response.data;
};

// Keep chart data as mock for now if backend doesn't provide specific time-series yet,
// or map from other data if possible. Swagger doesn't explicitly show a chart endpoint.
export const getChartData = async (_range: string = '7d'): Promise<any[]> => {
  // Mock data as fallback for UI visualization
  return [
    { name: 'Mon', issues: 12 },
    { name: 'Tue', issues: 19 },
    { name: 'Wed', issues: 15 },
    { name: 'Thu', issues: 22 },
    { name: 'Fri', issues: 30 },
    { name: 'Sat', issues: 10 },
    { name: 'Sun', issues: 8 },
  ];
};
