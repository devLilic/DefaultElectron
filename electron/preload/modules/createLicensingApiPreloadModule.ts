import type { PreloadModule } from '../../../src/shared/modules/contracts'
import { registerLicensingApi } from './licensingApi'

export function createLicensingApiPreloadModule(): PreloadModule {
  return {
    id: 'licensing-api',
    isEnabled(config) {
      return config.features.licensing && config.licensing.enabled
    },
    register() {
      registerLicensingApi()
    },
  }
}
