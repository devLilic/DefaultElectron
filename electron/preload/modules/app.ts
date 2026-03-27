import { contextBridge, ipcRenderer } from 'electron'
import type { ProgressInfo } from 'electron-updater'
import type { AppConfig } from '../../../config/types'

interface VersionInfo {
  update: boolean
  version: string
  newVersion?: string
}

interface UpdateErrorPayload {
  message: string
  error: Error
}

type VoidListener = () => void

function subscribe<T>(channel: string, listener: (payload: T) => void): VoidListener {
  const wrapped = (_event: Electron.IpcRendererEvent, payload: T) => listener(payload)
  ipcRenderer.on(channel, wrapped)

  return () => {
    ipcRenderer.off(channel, wrapped)
  }
}

export function registerAppPreloadApi(config: AppConfig) {
  contextBridge.exposeInMainWorld('appApi', {
    getConfig() {
      return config
    },
    onMainProcessMessage(listener: (message: string) => void) {
      return subscribe<string>('app:main-process-message', listener)
    },
    openWindow(route: string) {
      return ipcRenderer.invoke('app:open-window', route)
    },
    checkForUpdates() {
      return ipcRenderer.invoke('app:check-for-updates')
    },
    startUpdateDownload() {
      return ipcRenderer.invoke('app:start-update-download')
    },
    quitAndInstallUpdate() {
      return ipcRenderer.invoke('app:quit-and-install-update')
    },
    onUpdateAvailabilityChanged(listener: (payload: VersionInfo) => void) {
      return subscribe<VersionInfo>('update:availability-changed', listener)
    },
    onUpdateError(listener: (payload: UpdateErrorPayload) => void) {
      return subscribe<UpdateErrorPayload>('update:error', listener)
    },
    onUpdateDownloadProgress(listener: (payload: ProgressInfo) => void) {
      return subscribe<ProgressInfo>('update:download-progress', listener)
    },
    onUpdateDownloaded(listener: () => void) {
      const wrapped = () => listener()
      ipcRenderer.on('update:downloaded', wrapped)

      return () => {
        ipcRenderer.off('update:downloaded', wrapped)
      }
    },
  })
}
