import { indexHtmlPath, VITE_DEV_SERVER_URL } from './paths'
import { configureExternalLinks } from '../security/externalLinks'
import { createSecureBrowserWindow } from '../security/windowFactory'

export async function createMainWindow() {
  const window = createSecureBrowserWindow({
    title: 'Main window',
  })

  if (VITE_DEV_SERVER_URL) {
    await window.loadURL(VITE_DEV_SERVER_URL)
    window.webContents.openDevTools()
  } else {
    await window.loadFile(indexHtmlPath)
  }

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('app:main-process-message', new Date().toLocaleString())
  })

  configureExternalLinks(window)

  return window
}
