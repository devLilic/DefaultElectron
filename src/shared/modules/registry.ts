import type {
  BaseModule,
  MainModule,
  MainModuleContext,
  PreloadModule,
  PreloadModuleContext,
  RendererModule,
} from './contracts'
import type { AppConfig } from '../../../config/types'
import type { RendererAppConfig } from '../app/publicConfig'

export function resolveEnabledModules<T extends BaseModule>(
  modules: T[],
  config: AppConfig,
): T[] {
  return modules.filter((module) => module.isEnabled?.(config) ?? true)
}

export async function registerMainModules(
  modules: MainModule[],
  context: MainModuleContext,
) {
  const enabledModules = resolveEnabledModules(modules, context.config)

  for (const module of enabledModules) {
    await module.register(context)
  }

  return enabledModules
}

export function registerPreloadModules(
  modules: PreloadModule[],
  context: PreloadModuleContext,
) {
  const enabledModules = resolveEnabledModules(modules, context.config)

  for (const module of enabledModules) {
    module.register(context)
  }

  return enabledModules
}

export function resolveRendererModules(
  modules: RendererModule[],
  config: RendererAppConfig,
) {
  return modules.filter((module) => module.isEnabled?.(config) ?? true)
}
