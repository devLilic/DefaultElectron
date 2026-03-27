import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createLanguageStorage } from '../../../electron/main/modules/i18n/languageStorage'

const tempDirectories: string[] = []

afterEach(() => {
  while (tempDirectories.length > 0) {
    const directory = tempDirectories.pop()

    if (directory) {
      rmSync(directory, { recursive: true, force: true })
    }
  }
})

describe('language storage', () => {
  it('returns null before a language has been persisted', () => {
    const storageDir = createTempDir()
    const storage = createLanguageStorage(storageDir)

    expect(storage.getCurrentLanguage()).toBeNull()
  })

  it('persists and reloads the selected language locally', () => {
    const storageDir = createTempDir()
    const storage = createLanguageStorage(storageDir)

    storage.setCurrentLanguage('ro')

    const reloadedStorage = createLanguageStorage(storageDir)
    expect(reloadedStorage.getCurrentLanguage()).toBe('ro')

    const preferencesPath = path.join(storageDir, 'preferences.json')
    expect(JSON.parse(readFileSync(preferencesPath, 'utf8'))).toEqual({
      language: 'ro',
    })
  })
})

function createTempDir() {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'default-electron-app-language-'))
  tempDirectories.push(directory)
  return directory
}
