import { User, ApiResponse, CreateAdminRequest, Technician } from '../../types/api';
import { apiClient } from '../../services/api/api-client';

export const getUsers = async (): Promise<ApiResponse<Technician[]>> => {
  return apiClient.get<ApiResponse<Technician[]>>('/api/admin/technicians');
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  // Backwards compatibility or specific user fetch if endpoint existed
  return apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
};

export const createUser = async (user: CreateAdminRequest): Promise<ApiResponse<User>> => {
  return apiClient.post<ApiResponse<User>>('/api/admin/create-admin', user);
};

export const updateUser = async (id: string, user: Partial<User>): Promise<ApiResponse<User>> => {
  return apiClient.put<ApiResponse<User>>(`/api/users/${id}`, user);
};
