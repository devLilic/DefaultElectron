import { ipcMain } from 'electron'
import { indexHtmlPath, VITE_DEV_SERVER_URL } from '../bootstrap/paths'
import { createSecureBrowserWindow } from '../security/windowFactory'

export function registerCoreIpc() {
  ipcMain.handle('app:open-window', (_event, route: string) => {
    const childWindow = createSecureBrowserWindow({
      title: 'Child window',
    })

    if (VITE_DEV_SERVER_URL) {
      childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${route}`)
      return
    }

    childWindow.loadFile(indexHtmlPath, { hash: route })
  })
}
