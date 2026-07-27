import type { MainModule } from '../../../../src/shared/modules/contracts'
import { registerI18nModule } from './registerI18nModule'

export function createI18nMainModule(): MainModule {
  return {
    id: 'i18n',
    isEnabled(config) {
      return config.features.i18n && config.i18n.enabled
    },
    register(context) {
      registerI18nModule(context.config)
    },
  }
}
