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
  async setupPassword(data: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.AUTH.PASSWORD_SETUP,
        {
          setupToken: data.token,
          password: data.password
        }
      );
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
      const refreshToken = localStorage.getItem('refresh_token');
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh_token: refreshToken
      });
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
  /**
   * Request password reset (sends OTP)
   */
  async requestPasswordReset(emailOrPhone: string): Promise<{ sessionId: string }> {
    try {
      // Define specific response interface based on user provided JSON
      interface ResetInitiateResponse {
        success: boolean;
        data: {
          sessionId: string;
          expiresIn: number;
          expiresAt: string;
          contactMethod: string;
          maskedContact: string;
        };
        message: string;
      }

      const response = await apiClient.post<ResetInitiateResponse>(
        API_ENDPOINTS.PASSWORD_RESET.INITIATE,
        {
          emailOrPhone,
          contactMethod: emailOrPhone.includes('@') ? 'email' : 'sms'
        }
      );

      // Return the sessionId from the nested data object
      return { sessionId: response.data.data.sessionId };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify password reset OTP
   */
  async verifyResetOTP(sessionId: string, otp: string): Promise<{ resetToken: string }> {
    try {
      interface VerifyOtpResponse {
        success: boolean;
        data: {
          resetToken: string;
          expiresIn: number;
          expiresAt: string;
        };
        message: string;
      }

      const response = await apiClient.post<VerifyOtpResponse>(
        API_ENDPOINTS.PASSWORD_RESET.VERIFY_OTP,
        { sessionId, otp }
      );

      return { resetToken: response.data.data.resetToken };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Complete password reset
   */
  async completePasswordReset(data: { resetToken: string; newPassword: string }): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.PASSWORD_RESET.COMPLETE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default authService;
