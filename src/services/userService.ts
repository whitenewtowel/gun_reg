import { apiClient, handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';
import type { ApiResponse, User } from '@/types';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  ghanaCardNumber?: string;
  // password change is typically a separate endpoint, keeping to profile fields for now
}

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.ME);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: handleApiError(error),
        data: null as unknown as User
      };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(API_ENDPOINTS.USER.UPDATE_ME, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: handleApiError(error),
        data: null as unknown as User
      };
    }
  }
};
