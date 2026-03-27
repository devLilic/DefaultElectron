import { contextBridge } from 'electron'
import {
  ipcInvokeChannels,
  type LicensingActivationPayload,
  type LicensingEntitlementsPayload,
} from '../../../src/shared/ipc/contracts'
import { invoke } from './shared'

export function registerLicensingApi() {
  contextBridge.exposeInMainWorld('licensingApi', {
    getStatus() {
      return invoke(ipcInvokeChannels.licensingGetStatus)
    },
    activateLicense(payload: LicensingActivationPayload) {
      return invoke(ipcInvokeChannels.licensingActivate, payload)
    },
    getEntitlements(payload: LicensingEntitlementsPayload) {
      return invoke(ipcInvokeChannels.licensingGetEntitlements, payload)
    },
  })
}
