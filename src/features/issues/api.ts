import { Issue, ScopedIssuesResponse, ApiResponse } from '../../types/api';
import * as issuesApi from '../../services/api/issues';

export const getIssues = async (params: { 
  status?: string; 
  category?: string; 
  page?: number; 
  limit?: number;
} = {}): Promise<ScopedIssuesResponse> => {
  return issuesApi.getIssues(params);
};

export const getIssueById = async (id: string): Promise<ApiResponse<Issue>> => {
  return issuesApi.getIssueById(id);
};

export const createIssue = async (formData: FormData): Promise<ApiResponse<Issue>> => {
  return issuesApi.createIssue(formData);
};

export const assignIssue = async (issueId: string, technicianId: string): Promise<ApiResponse<Issue>> => {
  return issuesApi.assignIssue(issueId, technicianId);
};

export const voteIssue = async (issueId: string): Promise<ApiResponse<{ votes: number }>> => {
  return issuesApi.voteIssue(issueId);
};
