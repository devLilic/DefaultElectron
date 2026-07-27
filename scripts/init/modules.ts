import type { StarterModuleId } from './types'

export interface StarterModuleManifest {
  id: StarterModuleId
  dependencies: string[]
  devDependencies: string[]
  configKeys: string[]
  validation: string[]
  documentation: string
}

export const starterModuleManifests: Record<StarterModuleId, StarterModuleManifest> = {
  i18n: {
    id: 'i18n',
    dependencies: ['i18next', 'react-i18next'],
    devDependencies: [],
    configKeys: ['APP_I18N_DEFAULT_LANGUAGE', 'APP_I18N_SUPPORTED_LANGUAGES'],
    validation: ['npm run typecheck', 'npm test'],
    documentation: 'docs/MODULES.md#i18n',
  },
  autoUpdate: {
    id: 'autoUpdate',
    dependencies: ['electron-updater'],
    devDependencies: [],
    configKeys: ['APP_UPDATE_OWNER', 'APP_UPDATE_REPO', 'APP_UPDATE_VISIBILITY'],
    validation: ['npm run validate:release', 'npm run build'],
    documentation: 'docs/RELEASES.md',
  },
  appProtection: {
    id: 'appProtection',
    dependencies: [],
    devDependencies: [],
    configKeys: ['APP_APP_PROTECTION_ENABLED', 'APP_APP_PROTECTION_ALLOW_DEVTOOLS'],
    validation: ['npm run typecheck'],
    documentation: 'docs/MODULES.md#app-protection',
  },
  licensing: {
    id: 'licensing',
    dependencies: [],
    devDependencies: [],
    configKeys: ['APP_LICENSING_API_BASE_URL', 'APP_LICENSING_PROVIDER'],
    validation: ['npm test'],
    documentation: 'docs/MODULES.md#licensing',
  },
  database: {
    id: 'database',
    dependencies: ['better-sqlite3', 'drizzle-orm'],
    devDependencies: ['@types/better-sqlite3'],
    configKeys: ['APP_DATABASE_FILE_NAME'],
    validation: ['npm rebuild better-sqlite3', 'npm test'],
    documentation: 'docs/MODULES.md#database',
  },
  logging: {
    id: 'logging',
    dependencies: [],
    devDependencies: [],
    configKeys: ['APP_LOG_LEVEL'],
    validation: ['npm test'],
    documentation: 'docs/MODULES.md#logging',
  },
}
