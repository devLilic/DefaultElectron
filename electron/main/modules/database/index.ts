import type { AppConfig } from '../../../../config/types'
import { app } from 'electron'
import { registerDatabaseIpc } from './ipc'
import { createDatabaseConnection } from './connection'
import { createAppMetadataRepository } from './repositories'
import { createAppMetadataService } from './services'
import type { DatabaseModuleState } from './types'

export async function registerDatabaseModule(config: AppConfig): Promise<DatabaseModuleState> {
  registerDatabaseIpc(config)
  const connection = await createDatabaseConnection(config, app.getPath('userData'))

  createAppMetadataService(createAppMetadataRepository(connection))

  return {
    connection,
  }
}

export * from './testUtils'
