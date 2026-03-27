import { describe, expect, it } from 'vitest'
import { loadConfig } from '../../../config/loadConfig'

describe('loadConfig', () => {
  it('resolves development config by default', () => {
    const config = loadConfig(undefined, {})

    expect(config.environment).toBe('development')
    expect(config.features.autoUpdate).toBe(false)
    expect(config.features.appProtection).toBe(false)
    expect(config.features.licensing).toBe(false)
    expect(config.features.logging).toBe(true)
    expect(config.logging.level).toBe('debug')
    expect(config.update.autoCheck).toBe(true)
    expect(config.update.autoDownload).toBe(false)
    expect(config.update.provider.visibility).toBe('public')
  })

  it('resolves production config from mode', () => {
    const config = loadConfig('production', {})

    expect(config.environment).toBe('production')
    expect(config.appProtection.allowDevTools).toBe(false)
    expect(config.appProtection.enabled).toBe(false)
    expect(config.appProtection.profile).toBe('standard')
    expect(config.logging.level).toBe('info')
  })

  it('applies feature and nested env overrides', () => {
    const config = loadConfig('production', {
      APP_FEATURE_I18N: 'true',
      APP_FEATURE_AUTO_UPDATE: 'true',
      APP_FEATURE_APP_PROTECTION: 'true',
      APP_FEATURE_DATABASE: 'true',
      APP_UPDATE_OWNER: 'acme',
      APP_UPDATE_REPO: 'starter',
      APP_UPDATE_VISIBILITY: 'private',
      APP_UPDATE_AUTO_CHECK: 'false',
      APP_I18N_DEFAULT_LANGUAGE: 'ro',
      APP_I18N_SUPPORTED_LANGUAGES: 'en,ro',
      APP_I18N_NAMESPACES: 'common,settings',
      APP_DATABASE_FILE_NAME: 'starter.sqlite',
      APP_LOG_LEVEL: 'warn',
      APP_APP_PROTECTION_ENABLED: 'true',
      APP_APP_PROTECTION_PROFILE: 'commercial',
    })

    expect(config.features.i18n).toBe(true)
    expect(config.features.autoUpdate).toBe(true)
    expect(config.features.database).toBe(true)
    expect(config.update.enabled).toBe(true)
    expect(config.update.autoCheck).toBe(false)
    expect(config.update.provider.owner).toBe('acme')
    expect(config.update.provider.repo).toBe('starter')
    expect(config.update.provider.visibility).toBe('private')
    expect(config.i18n.enabled).toBe(true)
    expect(config.appProtection.enabled).toBe(true)
    expect(config.appProtection.profile).toBe('commercial')
    expect(config.i18n.defaultLanguage).toBe('ro')
    expect(config.i18n.supportedLanguages).toEqual(['en', 'ro'])
    expect(config.i18n.namespaces).toEqual(['common', 'settings'])
    expect(config.database.enabled).toBe(true)
    expect(config.database.fileName).toBe('starter.sqlite')
    expect(config.logging.level).toBe('warn')
  })

  it('prefers APP_ENV over mode and supports explicit nested disables', () => {
    const config = loadConfig('development', {
      APP_ENV: 'production',
      APP_FEATURE_APP_PROTECTION: 'true',
      APP_APP_PROTECTION_ENABLED: 'false',
      APP_FEATURE_LOGGING: 'false',
      APP_LOGGING_ENABLED: 'true',
    })

    expect(config.environment).toBe('production')
    expect(config.features.appProtection).toBe(false)
    expect(config.appProtection.enabled).toBe(false)
    expect(config.appProtection.profile).toBe('standard')
    expect(config.features.logging).toBe(true)
    expect(config.logging.enabled).toBe(true)
  })
})
