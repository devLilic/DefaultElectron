import type { MainModule } from '../../../../src/shared/modules/contracts'
import { registerLicensingModule } from './registerLicensingModule'

export function createLicensingMainModule(): MainModule {
  return {
    id: 'licensing',
    isEnabled(config) {
      return config.features.licensing && config.licensing.enabled
    },
    register(context) {
      registerLicensingModule(context.config)
    },
  }
}
