import { User } from '../../types';
import * as usersApi from '../../services/api/users';

const USE_MOCK = true;

export const getUsers = async (currentUser?: User | null): Promise<User[]> => {
  if (USE_MOCK) {
    return usersApi.getUsers(currentUser);
  }
  // return apiClient.get<User[]>('/users');
  return [];
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  if (USE_MOCK) {
    return usersApi.getUserById(id);
  }
  // return apiClient.get<User>(`/users/${id}`);
  return undefined;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  if (USE_MOCK) {
    return usersApi.createUser(user);
  }
  // return apiClient.post<User>('/users', user);
  return {} as User;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  if (USE_MOCK) {
    return usersApi.updateUser(id, user);
  }
  // return apiClient.put<User>(`/users/${id}`, user);
  return {} as User;
};
