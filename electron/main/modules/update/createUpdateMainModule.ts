import type { MainModule } from '../../../../src/shared/modules/contracts'
import { registerUpdateModule } from './registerUpdateModule'

export function createUpdateMainModule(): MainModule {
  return {
    id: 'update',
    isEnabled(config) {
      return config.features.autoUpdate
    },
    register(context) {
      registerUpdateModule(context.getMainWindow, context.config)
    },
  }
}
