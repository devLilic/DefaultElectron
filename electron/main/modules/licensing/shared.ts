import type { AppConfig } from '../../../../config/types'
import type {
  DegradedModeStatus,
  LicenseActivationResult,
  LicenseEntitlementsResult,
  LicenseGracePeriod,
  LicenseHeartbeatResult,
  LicenseStatusSnapshot,
  LicenseValidationResult,
} from '../../../../src/shared/licensing/contracts'

export function createLicenseGracePeriod(config: AppConfig): LicenseGracePeriod {
  return {
    active: false,
    startedAt: null,
    endsAt: null,
    remainingDays: config.licensing.gracePeriodDays,
  }
}

export function createDegradedModeStatus(config: AppConfig): DegradedModeStatus {
  return {
    active: false,
    mode: 'none',
    reason: null,
  }
}

export function createInactiveLicenseStatus(config: AppConfig): LicenseStatusSnapshot {
  return {
    enabled: false,
    status: 'unlicensed',
    activated: false,
    validated: false,
    lastValidatedAt: null,
    entitlements: {
      items: [],
    },
    gracePeriod: createLicenseGracePeriod(config),
    degradedMode: {
      active: false,
      mode: config.licensing.degradedMode,
      reason: 'Licensing is disabled.',
    },
  }
}

export function createActivationFailure(
  config: AppConfig,
  status: LicenseActivationResult['status'],
  reason: string,
): LicenseActivationResult {
  return {
    success: false,
    status,
    activatedAt: null,
    entitlements: {
      items: [],
    },
    gracePeriod: createLicenseGracePeriod(config),
    degradedMode: {
      active: true,
      mode: config.licensing.degradedMode,
      reason,
    },
  }
}

export function createValidationFailure(
  config: AppConfig,
  status: LicenseValidationResult['status'],
  reason: string,
): LicenseValidationResult {
  return {
    valid: false,
    status,
    validatedAt: null,
    entitlements: {
      items: [],
    },
    gracePeriod: createLicenseGracePeriod(config),
    degradedMode: {
      active: true,
      mode: config.licensing.degradedMode,
      reason,
    },
  }
}

export function createHeartbeatFailure(
  config: AppConfig,
  status: LicenseHeartbeatResult['status'],
  reason: string,
): LicenseHeartbeatResult {
  return {
    ok: false,
    status,
    heartbeatAt: null,
    gracePeriod: createLicenseGracePeriod(config),
    degradedMode: {
      active: true,
      mode: config.licensing.degradedMode,
      reason,
    },
  }
}

export function createEntitlementsFailure(
  config: AppConfig,
  status: LicenseEntitlementsResult['status'],
  reason: string,
): LicenseEntitlementsResult {
  return {
    status,
    entitlements: {
      items: [],
    },
    degradedMode: {
      active: true,
      mode: config.licensing.degradedMode,
      reason,
    },
  }
}
