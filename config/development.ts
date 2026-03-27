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
    allowDevTools: true,
  },
  licensing: {
    ...baseConfig.licensing,
    enabled: false,
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
