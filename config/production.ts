import { baseConfig } from './base'
import type { AppConfig } from './types'

export const productionConfig: AppConfig = {
  ...baseConfig,
  environment: 'production',
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
    allowDevTools: false,
  },
  licensing: {
    ...baseConfig.licensing,
    enabled: false,
    deviceBinding: true,
    enforceMachineMatch: true,
    allowGraceOnMismatch: false,
    gracePeriodDays: 7,
    heartbeatIntervalMs: 21600000,
    degradedMode: 'readonly',
    provider: 'http',
    apiBaseUrl: null,
    timeoutMs: 5000,
    endpoints: {
      ...baseConfig.licensing.endpoints,
    },
  },
  logging: {
    ...baseConfig.logging,
    level: 'info',
  },
}
