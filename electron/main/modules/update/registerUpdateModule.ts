import { app, ipcMain, type BrowserWindow } from 'electron'
import { createRequire } from 'node:module'
import type {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from 'electron-updater'
import type { AppConfig } from '../../../../config/types'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

let updateHandlersRegistered = false

export function registerUpdateModule(
  getMainWindow: () => BrowserWindow | null,
  config: AppConfig,
) {
  if (updateHandlersRegistered) {
    return
  }

  updateHandlersRegistered = true

  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    getMainWindow()?.webContents.send('update:availability-changed', {
      update: true,
      version: app.getVersion(),
      newVersion: info.version,
    })
  })

  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    getMainWindow()?.webContents.send('update:availability-changed', {
      update: false,
      version: app.getVersion(),
      newVersion: info.version,
    })
  })

  ipcMain.handle('app:check-for-updates', async () => {
    if (!config.features.autoUpdate) {
      return {
        message: 'Auto update is disabled by configuration.',
        error: new Error('Auto update is disabled by configuration.'),
      }
    }

    if (!app.isPackaged) {
      return {
        message: 'The update feature is only available after packaging.',
        error: new Error('The update feature is only available after packaging.'),
      }
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      return { message: 'Network error', error }
    }
  })

  ipcMain.handle('app:start-update-download', (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          event.sender.send('update:error', { message: error.message, error })
          return
        }

        event.sender.send('update:download-progress', progressInfo)
      },
      () => {
        event.sender.send('update:downloaded')
      },
    )
  })

  ipcMain.handle('app:quit-and-install-update', () => {
    autoUpdater.quitAndInstall(false, true)
  })
}

function startDownload(
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.once('error', (error: Error) => callback(error, null))
  autoUpdater.on('download-progress', (info: ProgressInfo) => callback(null, info))
  autoUpdater.once('update-downloaded', complete)
  autoUpdater.downloadUpdate()
}
