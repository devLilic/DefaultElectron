import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import type { AppConfig } from '../../../../config/types'
import type { DatabaseConnection, DatabaseConnectionPlan } from './types'
import { databaseSchema } from './schema'

export function createDatabaseConnectionPlan(
  config: AppConfig,
  storageDir: string,
): DatabaseConnectionPlan {
  const inMemory = config.database.inMemoryForTests
  const filePath = inMemory ? ':memory:' : path.join(storageDir, config.database.fileName)

  return {
    kind: 'sqlite',
    provider: 'sqlite',
    orm: 'drizzle',
    fileName: config.database.fileName,
    filePath,
    inMemory,
  }
}

export async function createDatabaseConnection(
  config: AppConfig,
  storageDir: string,
): Promise<DatabaseConnection> {
  const plan = createDatabaseConnectionPlan(config, storageDir)

  if (!plan.inMemory) {
    mkdirSync(path.dirname(plan.filePath), { recursive: true })
  }

  const { drizzle } = await import('drizzle-orm/sqlite-proxy')
  const client = new DatabaseSync(plan.filePath, {
    enableForeignKeyConstraints: true,
  })
  try {
    if (!plan.inMemory) {
      client.exec('PRAGMA journal_mode = WAL;')
    }
    const db = drizzle(async (query, params, method) => {
      const statement = client.prepare(query)
      statement.setReturnArrays(true)
      const values = params as SQLInputValue[]

      switch (method) {
        case 'all':
        case 'values':
          return { rows: statement.all(...values) }
        case 'get':
          // Drizzle expects one flat row, or undefined when no row matched.
          return { rows: statement.get(...values) as unknown as unknown[] }
        case 'run':
          statement.run(...values)
          return { rows: [] }
        default:
          throw new Error(`Unsupported SQLite query method: ${method}`)
      }
    }, { schema: databaseSchema })

    return {
      plan,
      client,
      db,
      close() {
        client.close()
      },
    }
  } catch (error) {
    client.close()
    throw error
  }
}
