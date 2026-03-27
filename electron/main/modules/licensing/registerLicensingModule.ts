import { app, ipcMain } from 'electron'
import { createHash, randomUUID } from 'node:crypto'
import type { AppConfig } from '../../../../config/types'
import { createLicensingLogger, createLogger } from '../../logging'
import { ipcInvokeChannels, type IpcInvokeContract } from '../../../../src/shared/ipc/contracts'
import { createSettingsStore } from '../settings/settingsStore'
import { createLicensingProvider } from './createLicensingProvider'
import { createHeartbeatScheduler } from './heartbeatScheduler'

export function registerLicensingModule(config: AppConfig) {
  const licensingLogger = createLicensingLogger(createLogger({ logging: config.logging }, 'licensing'))
  const provider = createLicensingProvider(config)
  const settingsStore = createSettingsStore(app.getPath('userData'))
  const heartbeatScheduler = createHeartbeatScheduler(config, provider, settingsStore)

  heartbeatScheduler.start()
  if (heartbeatScheduler.isRunning()) {
    licensingLogger.schedulerStarted(config.licensing.heartbeatIntervalMs)
  }

  ipcMain.handle(ipcInvokeChannels.licensingGetStatus, () => {
    licensingLogger.statusQueried()
    return provider.getStatus()
  })

  ipcMain.handle(
    ipcInvokeChannels.licensingActivate,
    async (_event, payload: IpcInvokeContract[typeof ipcInvokeChannels.licensingActivate]['request']) => {
      const result = await provider.activate(payload)
      licensingLogger.activated(result.success)

      if (result.success) {
        const licensingCache = settingsStore.getSetting('licensingCache')

        settingsStore.setSetting('licensingCache', {
          ...licensingCache,
          activeLicenseKey: payload.key,
          installationId: licensingCache.installationId ?? randomUUID(),
          licenseKeyHash: createHash('sha256').update(payload.key).digest('hex'),
          lastValidatedAt: result.activatedAt,
        })
      }

      return result
    },
  )

  ipcMain.handle(
    ipcInvokeChannels.licensingGetEntitlements,
    (_event, payload: IpcInvokeContract[typeof ipcInvokeChannels.licensingGetEntitlements]['request']) => {
      licensingLogger.entitlementsQueried()
      return provider.getEntitlements(payload)
    },
  )
}
