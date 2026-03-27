import type { AppConfig } from '../../../config/types'
import type { BrowserWindow } from 'electron'
import { registerMainModules } from '../../../src/shared/modules/registry'
import { createCoreMainModule } from '../modules/core/createCoreMainModule'
import { createUpdateMainModule } from '../modules/update/createUpdateMainModule'

export function registerMainModuleRegistry(
  config: AppConfig,
  getMainWindow: () => BrowserWindow | null,
) {
  return registerMainModules(
    [
      createCoreMainModule(),
      createUpdateMainModule(),
    ],
    {
      config,
      getMainWindow,
    },
  )
}
