/**
 * KYC API Service
 * Handles KYC onboarding and verification
 */

import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
  email?: string;
}

export interface KYCStartData {
  email: string;
  phone: string;
  ghana_card_number: string;
  delivery_channel: 'sms' | 'email';
  region_code: string;
  city: string;
  emergency_contact?: EmergencyContact;
}

export interface KYCStartResponseData {
  registration_session_id: string;
  email_masked: string;
  phone_masked: string;
  delivery_channel: string;
  otp_expires_in: number;
  max_attempts: number;
}

export interface KYCStartResponse {
  success: boolean;
  message: string;
  data: KYCStartResponseData;
}

export interface OTPVerificationData {
  registration_session_id: string;
  otp: string;
}

export const kycService = {
  /**
   * Get existing KYC session
   */
  async getSession(contact: string): Promise<any | null> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.KYC.GET_SESSION,
        { params: { contact } }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Start KYC process
   */
  async startKYC(data: KYCStartData): Promise<KYCStartResponse> {
    try {
      const response = await apiClient.post<KYCStartResponse>(
        API_ENDPOINTS.KYC.START,
        data
      );
      return response.data;
    } catch (error: any) {
      // Re-throw the error object if it has a specific response structure we need
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify OTP and create account
   */
  async verifyOTP(data: OTPVerificationData): Promise<{
    success: boolean;
    message: string;
    data: {
      user_id: string;
      email: string;
      kyc_status: string;
    };
    access_token: string;
    refresh_token: string;
    expires_in: number;
    setup_code: string;
  }> {
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
        registration_session_id: sessionId,
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
