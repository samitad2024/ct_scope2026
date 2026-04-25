import { apiClient } from './api-client';
import { Issue, ScopedIssuesResponse, ApiResponse } from '../../types/api';

/**
 * Issues API service integrating with real backend
 */

export const getIssues = async (params: { 
  status?: string; 
  category?: string; 
  page?: number; 
  limit?: number;
} = {}): Promise<ScopedIssuesResponse> => {
  const queryParams = new URLSearchParams();
  if (params.status) queryParams.append('status', params.status);
  if (params.category) queryParams.append('category', params.category);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  return apiClient.get<ScopedIssuesResponse>(`/api/admin/scoped-issues?${queryParams.toString()}`);
};

export const getIssueById = async (id: string): Promise<ApiResponse<Issue>> => {
  return apiClient.get<ApiResponse<Issue>>(`/api/issues/${id}`);
};

export const createIssue = async (formData: FormData): Promise<ApiResponse<Issue>> => {
  return apiClient.upload<ApiResponse<Issue>>('/api/issues', formData);
};

export const assignIssue = async (issueId: string, technicianId: string): Promise<ApiResponse<Issue>> => {
  return apiClient.post<ApiResponse<Issue>>(`/api/admin/issues/${issueId}/assign`, { technicianId });
};

export const voteIssue = async (issueId: string): Promise<ApiResponse<{ votes: number }>> => {
  return apiClient.post<ApiResponse<{ votes: number }>>(`/api/issues/${issueId}/vote`, {});
};
