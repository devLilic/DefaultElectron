import { baseConfig } from './base'
import { developmentConfig } from './development'
import { productionConfig } from './production'
import type {
  AppConfig,
  AppConfigOverride,
  AppEnv,
  AppLanguage,
  AppEnvironment,
  DatabaseConfig,
  LoggingConfig,
  UpdateProviderConfig,
} from './types'

const DEFAULT_ENV: AppEnvironment = 'development'

export function loadConfig(
  mode = process.env.NODE_ENV,
  env: AppEnv = process.env,
): AppConfig {
  const environment = resolveEnvironment(mode, env)
  const environmentConfig = environment === 'production' ? productionConfig : developmentConfig

  return normalizeConfig(
    mergeConfig(
      mergeConfig(baseConfig, environmentConfig),
      readEnvOverrides(env, environment),
    ),
  )
}

function resolveEnvironment(mode: string | undefined, env: AppEnv): AppEnvironment {
  const value = env.APP_ENV ?? mode ?? DEFAULT_ENV
  return value === 'production' ? 'production' : 'development'
}

function readEnvOverrides(env: AppEnv, environment: AppEnvironment): AppConfigOverride {
  const featureI18n = parseBoolean(env.APP_FEATURE_I18N)
  const featureAutoUpdate = parseBoolean(env.APP_FEATURE_AUTO_UPDATE)
  const featureAppProtection = parseBoolean(env.APP_FEATURE_APP_PROTECTION)
  const featureLicensing = parseBoolean(env.APP_FEATURE_LICENSING)
  const featureDatabase = parseBoolean(env.APP_FEATURE_DATABASE)
  const featureLogging = parseBoolean(env.APP_FEATURE_LOGGING)
  const supportedLanguages = parseLanguages(env.APP_I18N_SUPPORTED_LANGUAGES)
  const namespaces = parseStringList(env.APP_I18N_NAMESPACES)
  const updateProvider = compactObject<Partial<UpdateProviderConfig>>({
    provider: env.APP_UPDATE_PROVIDER === 'github' ? 'github' : undefined,
    owner: env.APP_UPDATE_OWNER,
    repo: env.APP_UPDATE_REPO,
    visibility: parseUpdateVisibility(env.APP_UPDATE_VISIBILITY),
  })
  const update = compactObject<AppConfigOverride['update'] extends infer T ? Extract<T, object> : never>({
    enabled: parseBoolean(env.APP_UPDATE_ENABLED) ?? featureAutoUpdate,
    channel: env.APP_UPDATE_CHANNEL === 'latest' ? 'latest' : undefined,
    autoCheck: parseBoolean(env.APP_UPDATE_AUTO_CHECK),
    autoDownload: parseBoolean(env.APP_UPDATE_AUTO_DOWNLOAD),
    allowPrerelease: parseBoolean(env.APP_UPDATE_ALLOW_PRERELEASE),
    provider: updateProvider,
  })
  const database = compactObject<Partial<DatabaseConfig>>({
    enabled: parseBoolean(env.APP_DATABASE_ENABLED) ?? featureDatabase,
    client: env.APP_DATABASE_CLIENT === 'better-sqlite3' ? 'better-sqlite3' : undefined,
    orm: env.APP_DATABASE_ORM === 'drizzle' ? 'drizzle' : undefined,
    fileName: env.APP_DATABASE_FILE_NAME,
  })
  const logging = compactObject<Partial<LoggingConfig>>({
    enabled: parseBoolean(env.APP_LOGGING_ENABLED) ?? featureLogging,
    level: parseLogLevel(env.APP_LOG_LEVEL),
  })

  return compactOverride({
    environment,
    appName: env.APP_NAME,
    features: compactObject({
      i18n: featureI18n,
      autoUpdate: featureAutoUpdate,
      appProtection: featureAppProtection,
      licensing: featureLicensing,
      database: featureDatabase,
      logging: featureLogging,
    }),
    update,
    i18n: compactObject({
      enabled: parseBoolean(env.APP_I18N_ENABLED) ?? featureI18n,
      defaultLanguage: parseLanguage(env.APP_I18N_DEFAULT_LANGUAGE),
      supportedLanguages,
      namespaces,
    }),
    appProtection: compactObject({
      enabled: parseBoolean(env.APP_APP_PROTECTION_ENABLED) ?? featureAppProtection,
      allowDevTools: parseBoolean(env.APP_APP_PROTECTION_ALLOW_DEVTOOLS),
    }),
    licensing: compactObject({
      enabled: parseBoolean(env.APP_LICENSING_ENABLED) ?? featureLicensing,
      publicKey: parseNullableString(env.APP_LICENSING_PUBLIC_KEY),
    }),
    database,
    logging,
  })
}

function normalizeConfig(config: AppConfig): AppConfig {
  return {
    ...config,
    update: {
      ...config.update,
      enabled: config.update.enabled ?? config.features.autoUpdate,
    },
    i18n: {
      ...config.i18n,
      enabled: config.i18n.enabled ?? config.features.i18n,
    },
    appProtection: {
      ...config.appProtection,
      enabled: config.appProtection.enabled ?? config.features.appProtection,
    },
    licensing: {
      ...config.licensing,
      enabled: config.licensing.enabled ?? config.features.licensing,
    },
    database: {
      ...config.database,
      enabled: config.database.enabled ?? config.features.database,
    },
    logging: {
      ...config.logging,
      enabled: config.logging.enabled ?? config.features.logging,
    },
    features: {
      ...config.features,
      autoUpdate: config.update.enabled,
      i18n: config.i18n.enabled,
      appProtection: config.appProtection.enabled,
      licensing: config.licensing.enabled,
      database: config.database.enabled,
      logging: config.logging.enabled,
    },
  }
}

function mergeConfig(base: AppConfig, override: AppConfigOverride): AppConfig {
  return {
    ...base,
    ...override,
    features: {
      ...base.features,
      ...override.features,
    },
    update: {
      ...base.update,
      ...override.update,
      provider: {
        ...base.update.provider,
        ...override.update?.provider,
      },
    },
    i18n: {
      ...base.i18n,
      ...override.i18n,
    },
    appProtection: {
      ...base.appProtection,
      ...override.appProtection,
    },
    licensing: {
      ...base.licensing,
      ...override.licensing,
    },
    database: {
      ...base.database,
      ...override.database,
    },
    logging: {
      ...base.logging,
      ...override.logging,
    },
  }
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false
  }

  return undefined
}

function parseLanguage(value: string | undefined): AppLanguage | undefined {
  if (value === 'en' || value === 'ro' || value === 'ru') {
    return value
  }

  return undefined
}

function parseLanguages(value: string | undefined): AppLanguage[] | undefined {
  const items = parseStringList(value)

  if (!items) {
    return undefined
  }

  const languages = items
    .map(parseLanguage)
    .filter((language): language is AppLanguage => language !== undefined)

  return languages.length > 0 ? languages : undefined
}

function parseStringList(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined
  }

  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return items.length > 0 ? items : undefined
}

function parseNullableString(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseLogLevel(value: string | undefined) {
  if (
    value === 'silent' ||
    value === 'error' ||
    value === 'warn' ||
    value === 'info' ||
    value === 'debug'
  ) {
    return value
  }

  return undefined
}

function parseUpdateVisibility(value: string | undefined) {
  if (value === 'public' || value === 'private') {
    return value
  }

  return undefined
}

function compactObject<T extends Record<string, unknown>>(value: T): Partial<T> | undefined {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined)
  return entries.length > 0 ? (Object.fromEntries(entries) as Partial<T>) : undefined
}

function compactOverride(value: AppConfigOverride): AppConfigOverride {
  return compactObject(value) ?? {}
}
