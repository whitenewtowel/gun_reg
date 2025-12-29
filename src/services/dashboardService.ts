import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';
import type { DashboardData, ApiResponse } from '@/types';

export const dashboardService = {
  /**
   * Get main dashboard data (summary, recent activity, etc.)
   */
  getDashboardData: async (): Promise<ApiResponse<DashboardData>> => {
    try {
      const response = await apiClient.get<ApiResponse<DashboardData>>(API_ENDPOINTS.DASHBOARD.MAIN);
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      throw new Error(message);
    }
  },

  /**
   * Get dashboard summary statistics specifically
   */
  getSummary: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      throw new Error(message);
    }
  },

  /**
   * Get recent applications for dashboard
   */
  getRecentApplications: async (limit: number = 5) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.APPLICATIONS, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      throw new Error(message);
    }
  },

  /**
   * Get user's firearms for dashboard
   */
  getFirearms: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.FIREARMS);
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      throw new Error(message);
    }
  },
};
