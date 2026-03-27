import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadConfig } from '../../../config/loadConfig'
import {
  createHeartbeatScheduler,
  isHeartbeatSchedulerEnabled,
} from '../../../electron/main/modules/licensing/heartbeatScheduler'
import type { LicensingProvider } from '../../../electron/main/modules/licensing/LicensingProvider'
import type { SettingsStore } from '../../../electron/main/modules/settings/settingsStore'

describe('heartbeat scheduler gating', () => {
  it('stays disabled in development', () => {
    const config = loadConfig('development', {
      APP_FEATURE_LICENSING: 'true',
      APP_LICENSING_ENABLED: 'true',
      APP_LICENSING_HEARTBEAT_INTERVAL_MS: '1000',
    })

    expect(isHeartbeatSchedulerEnabled(config)).toBe(false)
  })

  it('stays disabled when the licensing feature flag is off', () => {
    const config = loadConfig('production', {
      APP_FEATURE_LICENSING: 'false',
      APP_LICENSING_ENABLED: 'true',
      APP_LICENSING_HEARTBEAT_INTERVAL_MS: '1000',
    })

    expect(isHeartbeatSchedulerEnabled(config)).toBe(false)
  })

  it('stays disabled when the configured interval is zero', () => {
    const config = loadConfig('production', {
      APP_FEATURE_LICENSING: 'true',
      APP_LICENSING_ENABLED: 'true',
      APP_LICENSING_HEARTBEAT_INTERVAL_MS: '0',
    })

    expect(isHeartbeatSchedulerEnabled(config)).toBe(false)
  })

  it('is enabled in production when licensing and interval are configured', () => {
    const config = loadConfig('production', {
      APP_FEATURE_LICENSING: 'true',
      APP_LICENSING_ENABLED: 'true',
      APP_LICENSING_HEARTBEAT_INTERVAL_MS: '1000',
    })

    expect(isHeartbeatSchedulerEnabled(config)).toBe(true)
  })
})

describe('heartbeat scheduler runtime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('schedules periodic heartbeats and persists heartbeat timestamps', async () => {
    const config = loadConfig('production', {
      APP_FEATURE_LICENSING: 'true',
      APP_LICENSING_ENABLED: 'true',
      APP_LICENSING_HEARTBEAT_INTERVAL_MS: '1000',
    })
    const heartbeat = vi.fn(async () => ({
      ok: true,
      status: 'active' as const,
      heartbeatAt: '2026-03-27T12:00:01.000Z',
      gracePeriod: {
        active: false,
        startedAt: null,
        endsAt: null,
        remainingDays: 7,
      },
      degradedMode: {
        active: false,
        mode: 'none' as const,
        reason: null,
      },
    }))
    const settings = {
      licensingCache: {
        lastValidatedAt: null,
        lastHeartbeatAt: null,
        licenseKeyHash: null,
        activeLicenseKey: 'license-key',
        installationId: 'install-1',
      },
    }
    const settingsStore: SettingsStore = {
      getSettings: () => ({
        language: null,
        updatePreferences: {
          autoCheck: true,
          downloadStrategy: 'manual',
        },
        licensingCache: settings.licensingCache,
        uiPreferences: {
          theme: 'system',
          density: 'comfortable',
        },
      }),
      getSetting: (key) => {
        return (key === 'licensingCache' ? settings.licensingCache : null) as never
      },
      setSetting: (key, value) => {
        if (key === 'licensingCache') {
          settings.licensingCache = value as typeof settings.licensingCache
        }

        return value as never
      },
    }
    const provider: LicensingProvider = {
      getStatus: vi.fn(),
      activate: vi.fn(),
      validate: vi.fn(),
      heartbeat,
      getEntitlements: vi.fn(),
    }

    const scheduler = createHeartbeatScheduler(config, provider, settingsStore)
    scheduler.start()

    await vi.advanceTimersByTimeAsync(1000)

    expect(heartbeat).toHaveBeenCalledWith({
      key: 'license-key',
      installationId: 'install-1',
      lastHeartbeatAt: null,
    })
    expect(settings.licensingCache.lastHeartbeatAt).toBe('2026-03-27T12:00:01.000Z')
    expect(settings.licensingCache.lastValidatedAt).toBe('2026-03-27T12:00:01.000Z')

    scheduler.stop()
    vi.useRealTimers()
  })
})
