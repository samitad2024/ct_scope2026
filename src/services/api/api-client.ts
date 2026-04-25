import { useAuthStore } from '../../hooks/useAuth';

/**
 * Standardized API Client for CitiScope Admin Dashboard
 */

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = useAuthStore.getState().token;
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      console.log(`[ApiClient] Request: ${options.method || 'GET'} ${fullUrl}`);
      if (options.body) {
        console.log(`[ApiClient] Body:`, options.body);
      }
      console.log(`[ApiClient] Auth Token present: ${!!token}`);
      
      const response = await fetch(fullUrl, config);
      console.log(`[ApiClient] Response Status: ${response.status} for ${endpoint}`);
      if (response.status === 401) {
        // Handle Unauthorized - Clear store and redirect to login
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized access. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action.');
      }

      if (response.status === 422) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Validation failed.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * For multipart/form-data (image uploads)
   */
  public async upload<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const token = useAuthStore.getState().token;
    
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    return response.json();
  }
}

// We use relative URL to ensure requests go through our local proxy server
// which forwards them to the real backend while avoiding CORS issues.
const apiUrl = ''; 
export const apiClient = new ApiClient(apiUrl);
