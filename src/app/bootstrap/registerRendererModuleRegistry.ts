import type { RendererAppConfig } from '@/shared/app/publicConfig'
import { resolveRendererModules } from '@/shared/modules/registry'
import { createUpdateRendererModule } from '@/features/update/module'

export function registerRendererModuleRegistry(config: RendererAppConfig) {
  return resolveRendererModules(
    [createUpdateRendererModule()],
    config,
  )
}
