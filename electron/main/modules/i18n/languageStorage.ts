import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { AppLanguage } from '../../../../config/types'

interface LanguagePreferences {
  language?: AppLanguage
}

export interface LanguageStorage {
  getCurrentLanguage: () => AppLanguage | null
  setCurrentLanguage: (language: AppLanguage) => AppLanguage
}

export function createLanguageStorage(storageDir: string): LanguageStorage {
  const filePath = path.join(storageDir, 'preferences.json')

  return {
    getCurrentLanguage() {
      const preferences = readPreferences(filePath)
      return preferences.language ?? null
    },
    setCurrentLanguage(language) {
      const preferences = readPreferences(filePath)
      writePreferences(filePath, {
        ...preferences,
        language,
      })
      return language
    },
  }
}

function readPreferences(filePath: string): LanguagePreferences {
  try {
    const fileContent = readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent) as LanguagePreferences
  } catch {
    return {}
  }
}

function writePreferences(filePath: string, preferences: LanguagePreferences) {
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(preferences, null, 2), 'utf8')
}
