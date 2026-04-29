import { apiClient } from './api-client';
import { ApiResponse, Task } from '../../types/api';

/**
 * Technician API service for task management
 */

export const getTechnicianTasks = async (): Promise<ApiResponse<Task[]>> => {
  return apiClient.get<ApiResponse<Task[]>>('/api/technician/tasks');
};

export const getUnfinishedTasks = async (): Promise<ApiResponse<Task[]>> => {
  return apiClient.get<ApiResponse<Task[]>>('/api/technician/tasks/unfinished');
};

export const getFinishedTasks = async (): Promise<ApiResponse<Task[]>> => {
  return apiClient.get<ApiResponse<Task[]>>('/api/technician/tasks/finished');
};

export const acceptTask = async (taskId: string): Promise<ApiResponse<any>> => {
  return apiClient.post<ApiResponse<any>>(`/api/technician/tasks/${taskId}/accept`, {});
};

export const startTask = async (taskId: string): Promise<ApiResponse<any>> => {
  return apiClient.post<ApiResponse<any>>(`/api/technician/tasks/${taskId}/start`, {});
};

export const completeTask = async (taskId: string): Promise<ApiResponse<any>> => {
  return apiClient.post<ApiResponse<any>>(`/api/technician/tasks/${taskId}/complete`, {});
};
