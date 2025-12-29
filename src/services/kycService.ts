/**
 * KYC API Service
 * Handles KYC onboarding and verification
 */

import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface KYCStartData {
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  ghanaCardNumber: string;
}

export interface KYCSession {
  sessionId: string;
  emailOrPhone: string;
  status: 'PENDING_OTP' | 'VERIFIED' | 'COMPLETED';
}

export interface OTPVerificationData {
  sessionId: string;
  otp: string;
  password: string;
}

export const kycService = {
  /**
   * Get existing KYC session
   */
  async getSession(emailOrPhone: string): Promise<KYCSession | null> {
    try {
      const response = await apiClient.get<KYCSession>(
        API_ENDPOINTS.KYC.GET_SESSION,
        { params: { emailOrPhone } }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Start KYC process
   */
  async startKYC(data: KYCStartData): Promise<KYCSession> {
    try {
      const response = await apiClient.post<KYCSession>(
        API_ENDPOINTS.KYC.START,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify OTP and create account
   */
  async verifyOTP(data: OTPVerificationData): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.KYC.VERIFY_OTP, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Resend OTP
   */
  async resendOTP(sessionId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.KYC.RESEND_OTP, {
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Check KYC status
   */
  async getUserStatus(emailOrPhone: string): Promise<{
    exists: boolean;
    status?: string;
  }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.KYC.USER_STATUS, {
        params: { emailOrPhone },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default kycService;
