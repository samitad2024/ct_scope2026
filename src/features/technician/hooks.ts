import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../hooks/useAuth';
import { 
  getTechnicianTasks, 
  getUnfinishedTasks, 
  getFinishedTasks, 
  acceptTask, 
  startTask, 
  completeTask 
} from './api';

export const useTechnicianTasks = () => {
  const { user } = useAuthStore();
  const isTechnician = user?.role === 'technician' || user?.role === 'federal_admin'; // Allowing federal admin as well if the error persists, but the error said 403 for federal admin.
  // Actually, the error message clearly says 403 for federal admin. So it REALLY is technician only.

  return useQuery({
    queryKey: ['technician', 'tasks'],
    queryFn: getTechnicianTasks,
    select: (response) => response.data || [],
    enabled: !!user && user.role === 'technician',
  });
};

export const useUnfinishedTasks = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['technician', 'tasks', 'unfinished'],
    queryFn: getUnfinishedTasks,
    select: (response) => response.data || [],
    enabled: !!user && user.role === 'technician',
  });
};

export const useFinishedTasks = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['technician', 'tasks', 'finished'],
    queryFn: getFinishedTasks,
    select: (response) => response.data || [],
    enabled: !!user && user.role === 'technician',
  });
};

export const useAcceptTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
    },
  });
};

export const useStartTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
    },
  });
};
