import type { AppConfig } from '../../../../config/types'
import type { DatabaseSync } from 'node:sqlite'
import type { SqliteRemoteDatabase } from 'drizzle-orm/sqlite-proxy'
import type { databaseSchema } from './schema'

export interface DatabaseModuleContext {
  config: AppConfig
}

export interface DatabaseConnectionPlan {
  kind: 'sqlite'
  provider: 'sqlite'
  orm: 'drizzle'
  fileName: string
  filePath: string
  inMemory: boolean
}

export interface DatabaseConnection {
  plan: DatabaseConnectionPlan
  client: DatabaseSync
  db: SqliteRemoteDatabase<typeof databaseSchema>
  close: () => void
}

export interface DatabaseModuleState {
  connection: DatabaseConnection | null
}
