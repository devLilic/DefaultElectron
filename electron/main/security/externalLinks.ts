import { shell, type BrowserWindow } from 'electron'

export function configureExternalLinks(window: BrowserWindow) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url)
    }

    return { action: 'deny' }
  })
}
