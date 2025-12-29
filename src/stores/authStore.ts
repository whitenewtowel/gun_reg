/**
 * Authentication Store (Zustand)
 * Manages authentication state and user session
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  updateTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, tokens) => {
        // Save tokens to localStorage for API client
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      updateTokens: (tokens) => {
        // Update tokens in localStorage
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
