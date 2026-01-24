/**
 * API Configuration
 * Contains all API endpoint paths and configuration
 */

import { env } from './env';

export const API_BASE_URL = env.apiBaseUrl;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // KYC & Onboarding (No Auth Required)
  KYC: {
    GET_SESSION: '/registration/get-session',
    START: '/registration/start',
    VERIFY_OTP: '/registration/verify-otp',
    RESEND_OTP: '/registration/resend-otp',
    USER_STATUS: '/registration/user-status',
  },

  // Biometric KYC
  BIOMETRIC_KYC: {
    INITIATE: '/biometric-kyc/initiate-ghana',
    STATUS: (userId: string) => `/biometric-kyc/status/${userId}`,
    COMPLETE: '/biometric-kyc/complete-kyc',
  },

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    PASSWORD_SETUP: '/auth/password/setup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify-token',
  },

  // Password Reset
  PASSWORD_RESET: {
    INITIATE: '/auth/password/reset/initiate',
    VERIFY_OTP: '/auth/password/reset/verify-otp',
    COMPLETE: '/auth/password/reset/complete',
  },

  // User Profile
  USER: {
    ME: '/users/me',
    UPDATE_ME: '/users/me',
  },

  // User Dashboard
  DASHBOARD: {
    MAIN: '/dashboard',
    FIREARMS: '/dashboard/firearms',
    APPLICATIONS: '/dashboard/applications',
    PAYMENTS: '/dashboard/payments',
    SUMMARY: '/dashboard/summary',
  },

  // Applications
  APPLICATIONS: {
    CREATE: '/applications',
    MY_APPLICATIONS: '/applications/my',
    GET_BY_ID: (id: string) => `/applications/${id}`,
    LIST_ALL: '/applications',
    APPROVE: (id: string) => `/applications/${id}/approve`,
    REJECT: (id: string) => `/applications/${id}/reject`,
    POLICE_OVERRIDE: (id: string) => `/applications/${id}/police-override`,
  },

  // Firearms
  FIREARMS: {
    REGISTER: '/firearms/register',
    SEARCH: '/firearms/search',
    GET_BY_ID: (id: string) => `/firearms/${id}`,
    UPDATE_STATUS: (id: string) => `/firearms/${id}/status`,
    TRANSFER: (id: string) => `/firearms/${id}/transfer`,
    OWNERSHIP_HISTORY: (id: string) => `/firearms/${id}/ownership-history`,
    REPORT_LOST: (id: string) => `/firearms/${id}/report-lost`,
    REPORT_STOLEN: (id: string) => `/firearms/${id}/report-stolen`,
    ASSIGN_SERIAL: (id: string) => `/firearms/${id}/assign-serial`,
  },

  // Licences
  LICENCES: {
    STATUS: '/licences/status',
    VALIDATE_BUYER: '/licences/validate-buyer',
    APPLY: '/licences/apply',
    MY_LICENCES: '/licences/my',
    GET_BY_ID: (id: string) => `/licences/${id}`,
    RENEW: (id: string) => `/licences/${id}/renew`,
  },

  // Admin - Licences
  ADMIN_LICENCES: {
    APPLICATIONS: '/admin/licences/applications',
    APPLICATION_BY_ID: (id: string) => `/admin/licences/applications/${id}`,
    APPROVE: (id: string) => `/admin/licences/applications/${id}/approve`,
    REJECT: (id: string) => `/admin/licences/applications/${id}/reject`,
    EXPIRING: '/admin/licences/expiring',
    NON_COMPLIANT: '/admin/licences/non-compliant',
  },

  // Dealers
  DEALERS: {
    REGISTER: '/dealers/register',
    ME: '/dealers/me',
    INVENTORY: '/dealers/inventory',
    SALES_HISTORY: '/dealers/sales-history',
    DOCUMENTS_STATUS: '/dealers/documents/status',
    DOCUMENTS: '/dealers/documents',
    ADMIN_PENDING: '/dealers/admin/pending',
    LIST_ALL: '/dealers',
    APPROVE: (id: string) => `/dealers/${id}/approve`,
    REJECT: (id: string) => `/dealers/${id}/reject`,
    REAPPLICATION_STATUS: '/dealers/reapplication/status',
    REAPPLICATION_SUBMIT: '/dealers/reapplication/submit',
  },

  // Payments
  PAYMENTS: {
    INITIATE: '/payments/initiate',
    MY_PAYMENTS: '/payments/my',
    GET_BY_ID: (id: string) => `/payments/${id}`,
    LIST_ALL: '/payments',
    WEBHOOK: (provider: string) => `/payments/webhook/${provider}`,
  },

  // Document Uploads
  UPLOADS: {
    DEALER_DOCUMENTS: (dealerId: string) => `/uploads/dealer/${dealerId}/documents`,
    FIREARM_DOCUMENTS: (firearmId: string) => `/uploads/firearm/${firearmId}/documents`,
    LICENCE_DOCUMENTS: (licenceId: string) => `/uploads/licence/${licenceId}/documents`,
    LIST_DOCUMENTS: (documentType: string, entityId: string) =>
      `/uploads/${documentType}/${entityId}/documents`,
    DELETE_DOCUMENT: (documentId: string) => `/uploads/documents/${documentId}`,
  },

  // Reports (Admin)
  REPORTS: {
    SUMMARY: '/reports/summary',
    FIREARMS_BY_REGION: '/reports/firearms-by-region',
    DEALER_ACTIVITY: '/reports/dealer-activity',
    APPLICATION_STATUS: '/reports/application-status',
    PAYMENTS_RECONCILIATION: '/reports/payments-reconciliation',
  },

  // Settings (Admin)
  SETTINGS: {
    LICENCE_FEES: '/settings/licence-fees',
    POLICIES: '/settings/policies',
    POLICY_BY_KEY: (key: string) => `/settings/policies/${key}`,
    INTEGRATIONS: '/settings/integrations',
    INTEGRATION_BY_NAME: (name: string) => `/settings/integrations/${name}`,
    TEST_INTEGRATION: (name: string) => `/settings/integrations/${name}/test`,
  },

  // Admin System
  ADMIN_SYSTEM: {
    INTERNAL_USERS: '/admin/system/internal-users',
    INTERNAL_USER_BY_ID: (id: string) => `/admin/system/internal-users/${id}`,
    ASSIGN_ROLE: (id: string) => `/admin/system/internal-users/${id}/roles`,
    REVOKE_ROLE: (id: string, role: string) =>
      `/admin/system/internal-users/${id}/roles/${role}`,
    AUDIT_LOGS: '/admin/system/audit-logs',
    PASSWORD_RESET: (id: string) => `/admin/system/internal-users/${id}/password-reset`,
  },

  // Regions
  REGIONS: {
    LIST: '/regions',
  },

  // Webhooks
  WEBHOOKS: {
    SMILE_ID: '/webhooks/smile-id',
    SMILE_ID_TEST: '/webhooks/smile-id/test',
  },
} as const;

/**
 * API Configuration Constants
 */
export const API_CONFIG = {
  TIMEOUT: 60000, // 60 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export default API_ENDPOINTS;
