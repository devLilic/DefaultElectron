import { shell, type BrowserWindow } from 'electron'
import { URL } from 'node:url'
import { VITE_DEV_SERVER_URL } from '../bootstrap/paths'

const allowedExternalProtocols = new Set(['https:'])
const allowedExternalHosts = new Set(
  (process.env.APP_ALLOWED_EXTERNAL_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
)

export function applyRuntimeSecurityPolicies(window: BrowserWindow) {
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) {
      void openExternalUrl(url)
    }

    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    if (isAllowedInAppNavigation(url)) {
      return
    }

    event.preventDefault()

    if (isAllowedExternalUrl(url)) {
      void openExternalUrl(url)
    }
  })
}

export function isAllowedExternalUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    return allowedExternalProtocols.has(parsedUrl.protocol) && isAllowedHost(parsedUrl.hostname)
  } catch {
    return false
  }
}

export function isAllowedInAppNavigation(url: string) {
  if (VITE_DEV_SERVER_URL) {
    try {
      return new URL(url).origin === new URL(VITE_DEV_SERVER_URL).origin
    } catch {
      return false
    }
  }

  return url === 'about:blank'
}

export function isAllowedHost(hostname: string) {
  return allowedExternalHosts.has(hostname.toLowerCase())
}

export async function openExternalUrl(url: string) {
  if (!isAllowedExternalUrl(url)) {
    return false
  }

  return shell.openExternal(url)
}
