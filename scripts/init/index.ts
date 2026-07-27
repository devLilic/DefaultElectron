import type { StarterFeatureSelection, StarterModuleId } from './types.ts'

export { starterInitInputDefinitions, starterModuleOptions } from './definitions.ts'
export { starterModuleManifests } from './modules.ts'
export {
  generateAppId,
  normalizeAppName,
  normalizeDisplayName,
  normalizePackageName,
  resolveStarterInitValues,
} from './transform.ts'
export type {
  StarterFeatureSelection,
  StarterInitInputDefinition,
  StarterInitInputKey,
  StarterInitInputValues,
  StarterModuleId,
  StarterModuleOption,
} from './types.ts'
export { starterModuleIds } from './types.ts'

export function resolveStarterFeatureSelection(
  enabledModules: readonly StarterModuleId[],
): StarterFeatureSelection {
  const enabledModuleSet = new Set(enabledModules)

  return {
    i18n: enabledModuleSet.has('i18n'),
    autoUpdate: enabledModuleSet.has('autoUpdate'),
    appProtection: enabledModuleSet.has('appProtection'),
    licensing: enabledModuleSet.has('licensing'),
    database: enabledModuleSet.has('database'),
    logging: enabledModuleSet.has('logging'),
  }
}
