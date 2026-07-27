import type { AppConfig } from '../../../config/types'

/** Configuration safe and necessary for renderer code. */
export interface RendererAppConfig {
  environment: AppConfig['environment']
  appName: AppConfig['appName']
  features: Pick<AppConfig['features'], 'i18n' | 'autoUpdate' | 'licensing' | 'database' | 'logging'>
  i18n: Pick<AppConfig['i18n'], 'enabled' | 'defaultLanguage' | 'supportedLanguages' | 'namespaces'>
}

export function toRendererAppConfig(config: AppConfig): RendererAppConfig {
  return {
    environment: config.environment,
    appName: config.appName,
    features: {
      i18n: config.features.i18n,
      autoUpdate: config.features.autoUpdate,
      licensing: config.features.licensing,
      database: config.features.database,
      logging: config.features.logging,
    },
    i18n: {
      enabled: config.i18n.enabled,
      defaultLanguage: config.i18n.defaultLanguage,
      supportedLanguages: [...config.i18n.supportedLanguages],
      namespaces: [...config.i18n.namespaces],
    },
  }
}
