/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://national-firearm-licensing-tracking.onrender.com/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'Ghana National Firearm Licensing System',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_ENV || 'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export default env;
