import type { PreloadModule } from '../../../src/shared/modules/contracts'
import { registerUpdateApi } from './updateApi'

export function createUpdateApiPreloadModule(): PreloadModule {
  return {
    id: 'update-api',
    isEnabled(config) {
      return config.features.autoUpdate && config.update.enabled && config.environment === 'production'
    },
    register() {
      registerUpdateApi()
    },
  }
}
