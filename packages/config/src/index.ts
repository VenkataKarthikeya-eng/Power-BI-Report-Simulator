/**
 * Dashboard Capsule AI — Environment & Application Constants Config
 */

export const APP_CONFIG = {
  appName: 'Dashboard Capsule AI',
  companyName: 'Dashboard Capsule AI, Inc.',
  version: '1.0.0',
  capsuleExtension: '.dcaps',
  magicHeader: 'DCAPSv1',
  defaultPageSize: 20,
  maxFileUploadSizeBytes: 524288000, // 500 MB
  supportedFormats: ['.pbix', '.pbit'],
  apiPrefix: '/api/v1',
  security: {
    jwtExpirySeconds: 900, // 15 mins
    refreshTokenExpirySeconds: 604800, // 7 days
    defaultShareExpiryDays: 14,
    ecdsaCurve: 'P-384',
    aesKeyLengthBits: 256,
  },
} as const;

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';
