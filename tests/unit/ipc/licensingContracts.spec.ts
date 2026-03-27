import { describe, expect, it } from 'vitest'
import {
  ipcInvokeChannels,
  type IpcInvokeContract,
} from '../../../src/shared/ipc/contracts'

describe('licensing ipc contracts', () => {
  it('defines the approved licensing invoke channels', () => {
    expect(ipcInvokeChannels.licensingGetStatus).toBe('licensing:get-status')
    expect(ipcInvokeChannels.licensingActivate).toBe('licensing:activate')
    expect(ipcInvokeChannels.licensingGetEntitlements).toBe('licensing:get-entitlements')
  })

  it('maps entitlements payloads to the licensing entitlements channel', () => {
    const payload: IpcInvokeContract[typeof ipcInvokeChannels.licensingGetEntitlements]['request'] = {
      key: 'license-key',
    }

    expect(payload).toEqual({
      key: 'license-key',
    })
  })
})
