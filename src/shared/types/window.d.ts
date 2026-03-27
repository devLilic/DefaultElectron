import type { AppConfig } from '../../../config/types'
import type { ProgressInfo } from 'electron-updater'
import type { UpdateErrorPayload, VersionInfo } from './update'

declare global {
  interface Window {
    appApi: {
      getConfig: () => AppConfig
      onMainProcessMessage: (listener: (message: string) => void) => () => void
      openWindow: (route: string) => Promise<void>
      checkForUpdates: () => Promise<unknown>
      startUpdateDownload: () => Promise<void>
      quitAndInstallUpdate: () => Promise<void>
      onUpdateAvailabilityChanged: (listener: (payload: VersionInfo) => void) => () => void
      onUpdateError: (listener: (payload: UpdateErrorPayload) => void) => () => void
      onUpdateDownloadProgress: (listener: (payload: ProgressInfo) => void) => () => void
      onUpdateDownloaded: (listener: () => void) => () => void
    }
  }
}

export {}
