import { createInstance, type i18n as I18nInstance, type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { AppConfig, AppLanguage, I18nConfig } from '../../config/types'
import enCommon from './locales/en/common.json'
import enErrors from './locales/en/errors.json'
import enSettings from './locales/en/settings.json'
import enUpdater from './locales/en/updater.json'
import roCommon from './locales/ro/common.json'
import roErrors from './locales/ro/errors.json'
import roSettings from './locales/ro/settings.json'
import roUpdater from './locales/ro/updater.json'
import ruCommon from './locales/ru/common.json'
import ruErrors from './locales/ru/errors.json'
import ruSettings from './locales/ru/settings.json'
import ruUpdater from './locales/ru/updater.json'

export const i18nNamespaces = ['common', 'settings', 'updater', 'errors'] as const
export const fallbackLanguage: AppLanguage = 'en'

export function isI18nEnabled(config: AppConfig) {
  return config.features.i18n && config.i18n.enabled
}

export function isSupportedLanguage(
  language: string | null | undefined,
  supportedLanguages: AppLanguage[],
): language is AppLanguage {
  return !!language && supportedLanguages.includes(language as AppLanguage)
}

export function getFallbackLanguage(config: Pick<AppConfig, 'i18n'> | { i18n: I18nConfig }): AppLanguage {
  return isSupportedLanguage(config.i18n.defaultLanguage, config.i18n.supportedLanguages)
    ? config.i18n.defaultLanguage
    : fallbackLanguage
}

export function resolveLanguage(
  language: string | null | undefined,
  config: Pick<AppConfig, 'i18n'> | { i18n: I18nConfig },
): AppLanguage {
  if (isSupportedLanguage(language, config.i18n.supportedLanguages)) {
    return language
  }

  return getFallbackLanguage(config)
}

export function createI18nResources(): Resource {
  return {
    en: {
      common: enCommon,
      settings: enSettings,
      updater: enUpdater,
      errors: enErrors,
    },
    ro: {
      common: roCommon,
      settings: roSettings,
      updater: roUpdater,
      errors: roErrors,
    },
    ru: {
      common: ruCommon,
      settings: ruSettings,
      updater: ruUpdater,
      errors: ruErrors,
    },
  }
}

export function createI18nInstance(config: AppConfig): I18nInstance {
  const instance = createInstance()
  const resolvedFallbackLanguage = getFallbackLanguage(config)

  instance.use(initReactI18next)
  void instance.init({
    resources: createI18nResources(),
    lng: resolvedFallbackLanguage,
    fallbackLng: resolvedFallbackLanguage,
    supportedLngs: config.i18n.supportedLanguages,
    ns: config.i18n.namespaces,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    initImmediate: false,
  })

  return instance
}
