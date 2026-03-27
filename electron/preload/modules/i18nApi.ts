import { contextBridge } from 'electron'
import { ipcInvokeChannels } from '../../../src/shared/ipc/contracts'
import { invoke } from './shared'

export function registerI18nApi() {
  contextBridge.exposeInMainWorld('i18nApi', {
    getResources(payload: { language: string; namespaces: string[] }) {
      return invoke(ipcInvokeChannels.i18nGetResources, payload)
    },
    setLanguage(payload: { language: string }) {
      return invoke(ipcInvokeChannels.i18nSetLanguage, payload)
    },
  })
}
