import type { RendererModule } from '@/shared/modules/contracts'
import UpdateFeature from './index'

export function createUpdateRendererModule(): RendererModule {
  return {
    id: 'update',
    isEnabled(config) {
      return config.features.autoUpdate
    },
    component: UpdateFeature,
  }
}
