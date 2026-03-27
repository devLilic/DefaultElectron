import { contextBridge } from 'electron'
import { ipcInvokeChannels, type LicensingActivationPayload } from '../../../src/shared/ipc/contracts'
import { invoke } from './shared'

export function registerLicensingApi() {
  contextBridge.exposeInMainWorld('licensingApi', {
    getStatus() {
      return invoke(ipcInvokeChannels.licensingGetStatus)
    },
    activate(payload: LicensingActivationPayload) {
      return invoke(ipcInvokeChannels.licensingActivate, payload)
    },
  })
}
