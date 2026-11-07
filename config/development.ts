import { baseConfig } from './base'
import type { AppConfig } from './types'

export const developmentConfig: AppConfig = {
  ...baseConfig,
  environment: 'development',
  features: {
    ...baseConfig.features,
    autoUpdate: false,
    appProtection: false,
    licensing: false,
  },
  update: {
    ...baseConfig.update,
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
    deviceBinding: false,
    enforceMachineMatch: false,
    allowGraceOnMismatch: false,
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
  logging: {
    ...baseConfig.logging,
    level: 'debug',
  },
}
