import type { AppConfig } from './types'

export const baseConfig: AppConfig = {
  environment: 'development',
  appName: 'Electron Starter',
  features: {
    i18n: false,
    autoUpdate: false,
    appProtection: false,
    licensing: false,
    database: false,
    logging: true,
  },
  update: {
    enabled: false,
    channel: 'latest',
    autoDownload: false,
    allowPrerelease: false,
    provider: {
      provider: 'github',
      owner: 'electron-vite',
      repo: 'electron-vite-react',
    },
  },
  i18n: {
    enabled: false,
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'ro', 'ru'],
    namespaces: ['common'],
  },
  appProtection: {
    enabled: false,
    allowDevTools: true,
  },
  licensing: {
    enabled: false,
    publicKey: null,
  },
  database: {
    enabled: false,
    client: 'better-sqlite3',
    orm: 'drizzle',
    fileName: 'app.db',
  },
  logging: {
    enabled: true,
    level: 'info',
  },
}
