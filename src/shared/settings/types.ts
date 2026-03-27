import type { AppLanguage } from '../../../config/types'

export interface UpdatePreferences {
  autoCheck: boolean
  downloadStrategy: 'manual'
}

export interface LicensingCache {
  lastValidatedAt: string | null
  lastHeartbeatAt: string | null
  licenseKeyHash: string | null
  activeLicenseKey: string | null
  installationId: string | null
}

export interface UiPreferences {
  theme: 'system' | 'light' | 'dark'
  density: 'comfortable' | 'compact'
}

export interface AppSettings {
  language: AppLanguage | null
  updatePreferences: UpdatePreferences
  licensingCache: LicensingCache
  uiPreferences: UiPreferences
}

export type SettingsKey = keyof AppSettings
