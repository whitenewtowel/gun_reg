/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginCredentials, LoginResponse, User, AuthTokens } from '@/types';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Setup password (first-time users)
   */
  async setupPassword(data: { token: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.PASSWORD_SETUP, {
        setupToken: data.token,
        password: data.password
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<AuthTokens>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  /**
   * Request password reset (sends OTP)
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.PASSWORD_RESET.INITIATE, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify password reset OTP
   */
  async verifyResetOTP(email: string, otp: string): Promise<{ resetToken: string }> {
    try {
      const response = await apiClient.post<{ resetToken: string }>(
        API_ENDPOINTS.PASSWORD_RESET.VERIFY_OTP,
        { email, otp }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Complete password reset
   */
  async completePasswordReset(data: { token: string; password: string }): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.PASSWORD_RESET.COMPLETE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default authService;
