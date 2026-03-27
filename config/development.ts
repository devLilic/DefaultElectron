import { baseConfig } from './base'
import type { AppConfig } from './types'

export const developmentConfig: AppConfig = {
  ...baseConfig,
  environment: 'development',
  features: {
    ...baseConfig.features,
    i18n: false,
    autoUpdate: false,
    appProtection: false,
    licensing: false,
    database: false,
    logging: true,
  },
  update: {
    ...baseConfig.update,
    enabled: false,
  },
  i18n: {
    ...baseConfig.i18n,
    enabled: false,
  },
  appProtection: {
    ...baseConfig.appProtection,
    enabled: false,
    profile: 'standard',
    allowDevTools: true,
  },
  licensing: {
    ...baseConfig.licensing,
    enabled: false,
    gracePeriodDays: 7,
    heartbeatIntervalMs: 21600000,
    degradedMode: 'readonly',
    provider: 'noop',
    apiBaseUrl: null,
    timeoutMs: 5000,
    endpoints: {
      ...baseConfig.licensing.endpoints,
    },
  },
  database: {
    ...baseConfig.database,
    enabled: false,
  },
  logging: {
    ...baseConfig.logging,
    enabled: true,
    level: 'debug',
  },
}
