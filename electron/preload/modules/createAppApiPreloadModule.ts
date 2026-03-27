import type { PreloadModule } from '../../../src/shared/modules/contracts'
import { registerAppPreloadApi } from './app'

export function createAppApiPreloadModule(): PreloadModule {
  return {
    id: 'app-api',
    register(context) {
      registerAppPreloadApi(context.config)
    },
  }
}
