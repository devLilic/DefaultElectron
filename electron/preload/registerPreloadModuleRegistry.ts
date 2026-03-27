import type { AppConfig } from '../../config/types'
import { registerPreloadModules } from '../../src/shared/modules/registry'
import { createAppApiPreloadModule } from './modules/createAppApiPreloadModule'

export function registerPreloadModuleRegistry(config: AppConfig) {
  return registerPreloadModules(
    [createAppApiPreloadModule()],
    { config },
  )
}
