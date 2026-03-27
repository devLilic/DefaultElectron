export type LicenseStatus =
  | 'unlicensed'
  | 'active'
  | 'grace-period'
  | 'degraded'
  | 'expired'
  | 'invalid'
  | 'revoked'

export type DegradedMode =
  | 'none'
  | 'readonly'
  | 'limited'
  | 'blocked'

export interface LicenseEntitlement {
  key: string
  name: string
  enabled: boolean
  limit?: number | null
}

export interface LicenseEntitlements {
  items: LicenseEntitlement[]
}

export interface LicenseEntitlementsRequest {
  key: string
}

export interface LicenseEntitlementsResult {
  status: LicenseStatus
  entitlements: LicenseEntitlements
  degradedMode: DegradedModeStatus
}

export interface LicenseGracePeriod {
  active: boolean
  startedAt: string | null
  endsAt: string | null
  remainingDays: number
}

export interface DegradedModeStatus {
  active: boolean
  mode: DegradedMode
  reason: string | null
}

export interface LicenseActivationRequest {
  key: string
  deviceName?: string
}

export interface LicenseActivationResult {
  success: boolean
  status: LicenseStatus
  activatedAt: string | null
  entitlements: LicenseEntitlements
  gracePeriod: LicenseGracePeriod
  degradedMode: DegradedModeStatus
}

export interface LicenseValidationRequest {
  key: string
  lastValidatedAt?: string | null
}

export interface LicenseValidationResult {
  valid: boolean
  status: LicenseStatus
  validatedAt: string | null
  entitlements: LicenseEntitlements
  gracePeriod: LicenseGracePeriod
  degradedMode: DegradedModeStatus
}

export interface LicenseHeartbeatRequest {
  key: string
  installationId: string
  lastHeartbeatAt?: string | null
}

export interface LicenseHeartbeatResult {
  ok: boolean
  status: LicenseStatus
  heartbeatAt: string | null
  gracePeriod: LicenseGracePeriod
  degradedMode: DegradedModeStatus
}

export interface LicenseStatusSnapshot {
  enabled: boolean
  status: LicenseStatus
  activated: boolean
  validated: boolean
  lastValidatedAt: string | null
  entitlements: LicenseEntitlements
  gracePeriod: LicenseGracePeriod
  degradedMode: DegradedModeStatus
}
