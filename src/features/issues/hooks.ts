import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIssues, getIssueById, createIssue, assignIssue, voteIssue } from './api';

export const useIssues = (params: { 
  status?: string; 
  category?: string; 
  page?: number; 
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: ['issues', params],
    queryFn: () => getIssues(params),
  });
};

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: ['issues', id],
    queryFn: () => getIssueById(id),
    enabled: !!id,
    select: (response) => response.data,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};

export const useAssignIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, technicianId }: { issueId: string, technicianId: string }) => 
      assignIssue(issueId, technicianId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues', variables.issueId] });
    },
  });
};
