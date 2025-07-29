// Environment Configuration
// 
// This file reads configuration from environment variables.
// To customize the API URL, create a .env file in the project root with:
// EXPO_PUBLIC_API_BASE_URL=http://your-api-server.com
//
// See .env.example for configuration examples.

export const ENV = {
  // API Base URL - reads from environment variable or falls back to defaults
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || (__DEV__ ? 'http://localhost:3000' : 'https://api-reports-18lh.onrender.com'),
};

export const isProduction = !__DEV__;
export const isDevelopment = __DEV__;

// Default test data for Araçuaí, MG
export const DEFAULT_LOCATION = {
  city: 'Araçuaí',
  state: 'MG',
  coordinates: [-16.8497, -42.0697] as [number, number],
};
