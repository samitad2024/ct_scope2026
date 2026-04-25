import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getPendingIssues } from './api';

/**
 * Dashboard data fetching hooks
 */

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    select: (response) => response.data,
  });
};

export const usePendingIssues = (params: { category?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'pending-issues', params],
    queryFn: () => getPendingIssues(params),
  });
};
