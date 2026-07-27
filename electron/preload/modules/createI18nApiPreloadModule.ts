import type { PreloadModule } from '../../../src/shared/modules/contracts'
import { registerI18nApi } from './i18nApi'

export function createI18nApiPreloadModule(): PreloadModule {
  return {
    id: 'i18n-api',
    isEnabled(config) {
      return config.features.i18n && config.i18n.enabled
    },
    register() {
      registerI18nApi()
    },
  }
}
