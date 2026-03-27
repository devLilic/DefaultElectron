import type { AppConfig } from '../../../config/types'
import type {
  AppInfoPayload,
  DatabaseQueryPayload,
  DatabaseQueryResult,
  I18nLanguagePayload,
  I18nResourcePayload,
  LicensingActivationPayload,
  LicensingActivationResult,
  LicensingStatusPayload,
  SettingsValuePayload,
} from '@/shared/ipc/contracts'
import type { ProgressInfo } from 'electron-updater'
import type { UpdateErrorPayload, VersionInfo } from './update'

declare global {
  interface Window {
    appApi: {
      getConfig: () => AppConfig
      getAppInfo: () => Promise<AppInfoPayload>
      onMainProcessMessage: (listener: (message: string) => void) => () => void
      openWindow: (route: string) => Promise<void>
    }
    updateApi: {
      checkForUpdates: () => Promise<unknown>
      startDownload: () => Promise<void>
      quitAndInstall: () => Promise<void>
      onAvailabilityChanged: (listener: (payload: VersionInfo) => void) => () => void
      onError: (listener: (payload: UpdateErrorPayload) => void) => () => void
      onDownloadProgress: (listener: (payload: ProgressInfo) => void) => () => void
      onDownloaded: (listener: () => void) => () => void
    }
    i18nApi: {
      getResources: (payload: { language: string; namespaces: string[] }) => Promise<I18nResourcePayload>
      setLanguage: (payload: I18nLanguagePayload) => Promise<void>
    }
    licensingApi: {
      getStatus: () => Promise<LicensingStatusPayload>
      activate: (payload: LicensingActivationPayload) => Promise<LicensingActivationResult>
    }
    databaseApi: {
      query: (payload: DatabaseQueryPayload) => Promise<DatabaseQueryResult>
    }
    settingsApi: {
      get: (payload: { key: string }) => Promise<SettingsValuePayload>
      set: (payload: SettingsValuePayload) => Promise<void>
    }
  }
}

export {}
