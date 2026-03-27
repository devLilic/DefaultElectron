import type { AppConfig } from '../../../../config/types'
import type { LicensingCache } from '../../../../src/shared/settings/types'
import type { SettingsStore } from '../settings/settingsStore'
import type { LicensingProvider } from './LicensingProvider'

export interface HeartbeatScheduler {
  start: () => void
  stop: () => void
  isRunning: () => boolean
}

type TimerHandle = ReturnType<typeof setInterval>

export function isHeartbeatSchedulerEnabled(config: AppConfig) {
  return (
    config.environment === 'production' &&
    config.features.licensing &&
    config.licensing.enabled &&
    config.licensing.heartbeatIntervalMs > 0
  )
}

export function createHeartbeatScheduler(
  config: AppConfig,
  provider: LicensingProvider,
  settingsStore: SettingsStore,
): HeartbeatScheduler {
  let intervalHandle: TimerHandle | null = null

  return {
    start() {
      if (!isHeartbeatSchedulerEnabled(config) || intervalHandle) {
        return
      }

      intervalHandle = setInterval(() => {
        void runHeartbeat(provider, settingsStore)
      }, config.licensing.heartbeatIntervalMs)
    },
    stop() {
      if (!intervalHandle) {
        return
      }

      clearInterval(intervalHandle)
      intervalHandle = null
    },
    isRunning() {
      return intervalHandle !== null
    },
  }
}

async function runHeartbeat(
  provider: LicensingProvider,
  settingsStore: SettingsStore,
) {
  const licensingCache = settingsStore.getSetting('licensingCache')

  if (!licensingCache.activeLicenseKey || !licensingCache.installationId) {
    return
  }

  const result = await provider.heartbeat({
    key: licensingCache.activeLicenseKey,
    installationId: licensingCache.installationId,
    lastHeartbeatAt: licensingCache.lastHeartbeatAt,
  })

  settingsStore.setSetting('licensingCache', {
    ...licensingCache,
    lastHeartbeatAt: result.heartbeatAt ?? licensingCache.lastHeartbeatAt,
    lastValidatedAt:
      result.status === 'active' || result.status === 'grace-period'
        ? result.heartbeatAt ?? licensingCache.lastValidatedAt
        : licensingCache.lastValidatedAt,
  })
}
