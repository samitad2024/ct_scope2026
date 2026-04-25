import { create } from 'zustand';
import { User, LoginResponse } from '../types/api';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (response: any) => {
        const token = response.accessToken || response.token || (response.data && (response.data.accessToken || response.data.token));
        const user = response.user || (response.data && response.data.user);
        
        set({ 
          user: user, 
          token: token, 
          isAuthenticated: !!token 
        });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
