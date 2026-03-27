import { contextBridge } from 'electron'
import { ipcInvokeChannels, type SettingsValuePayload } from '../../../src/shared/ipc/contracts'
import { invoke } from './shared'

export function registerSettingsApi() {
  contextBridge.exposeInMainWorld('settingsApi', {
    get(payload: { key: string }) {
      return invoke(ipcInvokeChannels.settingsGet, payload)
    },
    set(payload: SettingsValuePayload) {
      return invoke(ipcInvokeChannels.settingsSet, payload)
    },
  })
}
