import type { BrowserWindow } from 'electron'
import type { ComponentType } from 'react'
import type { AppConfig } from '../../../config/types'
import type { RendererAppConfig } from '../app/publicConfig'

export interface BaseModule {
  id: string
  isEnabled?: (config: AppConfig) => boolean
}

export interface MainModuleContext {
  config: AppConfig
  getMainWindow: () => BrowserWindow | null
}

export interface MainModule extends BaseModule {
  register: (context: MainModuleContext) => void | Promise<void>
}

export interface PreloadModuleContext {
  config: AppConfig
}

export interface PreloadModule extends BaseModule {
  register: (context: PreloadModuleContext) => void
}

export interface RendererModuleContext {
  config: RendererAppConfig
}

export interface RendererModule extends Omit<BaseModule, 'isEnabled'> {
  isEnabled?: (config: RendererAppConfig) => boolean
  component: ComponentType
}
