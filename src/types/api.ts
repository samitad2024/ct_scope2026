/**
 * API Response Interfaces based on Swagger definitions
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

export interface Issue {
  id: string;
  issue_number: string | null;
  title: string;
  description: string;
  category: string;
  address: string;
  reporter_id: string;
  status: 'reported' | 'verified' | 'assigned' | 'in_progress' | 'resolved';
  priority: string | null;
  source: string;
  reported_at: string;
  updated_at: string;
  assigned_to: string | null;
  image_url: string | null;
  severity: string | null;
  latitude: number;
  longitude: number;
  votes: number;
  assigned_by: string | null;
  assigned_at: string | null;
  woreda_id: string | null;
  zone_id: string | null;
  region_id: string | null;
  region_name: string;
  zone_name: string;
  woreda_name: string;
  reporter_name: string;
  assigned_technician?: Technician | null;
}

export interface ScopedIssuesResponse {
  success: boolean;
  issues: Issue[];
  total: number;
  page: number;
  limit: number;
}

export interface Technician {
  id: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  active_assignments: number;
}

export type UserRole = 'citizen' | 'woreda_admin' | 'city_admin' | 'zone_admin' | 'regional_admin' | 'federal_admin' | 'technician';

export interface User {
  id: string;
  phone: string;
  email: string;
  full_name: string;
  role: UserRole;
  language: string;
  admin_unit_id: string | null;
  is_verified: boolean;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface CreateAdminRequest {
  name: string;
  phone_number: string;
  password?: string;
  role: 'regional_admin' | 'zone_admin' | 'city_admin' | 'woreda_admin';
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  deadline: string | null;
  created_at: string;
  issue_id: string;
  issue_number: string | null;
  title: string;
  category: string;
  description: string;
  address: string;
  severity: string | null;
  issue_priority: string | null;
  completed_at?: string;
}
