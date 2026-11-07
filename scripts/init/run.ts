import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { applyStarterInit } from './applyStarterInit.ts'
import { starterModuleManifests } from './modules.ts'
import { resolveStarterFeatureSelection } from './index.ts'
import {
  normalizeDisplayName,
  normalizePackageName,
  resolveStarterInitValues,
  type StarterInitPartialInputValues,
} from './transform.ts'
import { starterModuleIds, type StarterModuleId } from './types.ts'

export function parseInitArgs(argv: string[]): StarterInitPartialInputValues & {
  updateOwner?: string
  updateRepo?: string
  updateVisibility?: 'public' | 'private'
  defaultLanguage?: 'en' | 'ro' | 'ru'
} {
  const values = new Map<string, string>()

  for (const arg of argv) {
    if (!arg.startsWith('--') || !arg.includes('=')) {
      throw new Error(`Arguments must use --key=value. Received "${arg}".`)
    }

    const [key, ...rest] = arg.slice(2).split('=')
    values.set(key, rest.join('='))
  }

  const modules = parseModules(values.get('modules') ?? 'logging')
  const defaultLanguage = values.get('default-language')
  const updateVisibility = values.get('update-visibility')

  if (defaultLanguage && !['en', 'ro', 'ru'].includes(defaultLanguage)) {
    throw new Error('default-language must be en, ro, or ru.')
  }

  if (updateVisibility && !['public', 'private'].includes(updateVisibility)) {
    throw new Error('update-visibility must be public or private.')
  }

  return {
    appName: values.get('app-name'),
    appId: values.get('app-id'),
    packageName: values.get('package-name'),
    displayName: values.get('display-name'),
    defaultLanguage: defaultLanguage as 'en' | 'ro' | 'ru' | undefined,
    updateOwner: values.get('update-owner'),
    updateRepo: values.get('update-repo'),
    updateVisibility: updateVisibility as 'public' | 'private' | undefined,
    initialEnabledModules: modules,
  }
}

export function parseModules(value: string): StarterModuleId[] {
  const modules = value.split(',').map((item) => item.trim()).filter(Boolean)

  for (const moduleId of modules) {
    if (!starterModuleIds.includes(moduleId as StarterModuleId)) {
      throw new Error(`Unsupported module "${moduleId}". Expected: ${starterModuleIds.join(', ')}.`)
    }
  }

  return [...new Set(modules)] as StarterModuleId[]
}

async function promptForInputs(): Promise<StarterInitPartialInputValues & {
  updateOwner?: string
  updateRepo?: string
  updateVisibility?: 'public' | 'private'
  defaultLanguage?: 'en' | 'ro' | 'ru'
}> {
  const prompt = createInterface({ input, output })
  try {
    const appName = (await prompt.question(
      'App name (e.g. acme, Enter to derive from the package name) > ',
    )) || undefined
    const packageNameHint = appName
      ? `Enter for ${normalizePackageName(appName)}`
      : 'Enter to derive from the display name'
    const packageName = (await prompt.question(
      `Package name (e.g. @acme/desktop or acme-desktop, ${packageNameHint}) > `,
    )) || undefined
    const defaultDisplayName = normalizeDisplayName(appName ?? packageName ?? 'Electron Starter')
    const displayName = (await prompt.question(`Display name (e.g. Acme Desktop, Enter for ${defaultDisplayName}) > `)) || undefined
    const { appId: defaultAppId } = resolveStarterInitValues({
      appName,
      packageName,
      displayName,
      initialEnabledModules: [],
    })
    const appId = await prompt.question(`App ID (reverse DNS, e.g. com.acme.desktop, Enter for ${defaultAppId}) > `)
    const modules = await prompt.question(
      `Modules (comma-separated, e.g. logging,i18n, Enter for logging). Choose from ${starterModuleIds.join(', ')} > `,
    )
    const selectedModules = parseModules(modules || 'logging')
    const defaultLanguage = await prompt.question('Default language (en, ro, ru, e.g. en, Enter for ro) > ')

    let updateOwner: string | undefined
    let updateRepo: string | undefined
    let updateVisibility: 'public' | 'private' | undefined
    if (selectedModules.includes('autoUpdate')) {
      updateOwner = await prompt.question('GitHub owner (username or organization, e.g. acme) > ')
      updateRepo = await prompt.question('GitHub repository (repo name only, e.g. acme-desktop) > ')
      updateVisibility = (await prompt.question(
        'Repository visibility (public or private, e.g. private, Enter for public) > ',
      ) || 'public') as 'public' | 'private'
    }

    return {
      appName,
      appId: appId || undefined,
      packageName,
      displayName,
      defaultLanguage: (defaultLanguage || 'ro') as 'en' | 'ro' | 'ru',
      updateOwner,
      updateRepo,
      updateVisibility,
      initialEnabledModules: selectedModules,
    }
  } finally {
    prompt.close()
  }
}

export function validateInitInputs(inputs: ReturnType<typeof resolveStarterInitValues>) {
  if (inputs.initialEnabledModules.includes('autoUpdate') &&
    (inputs.updateOwner.startsWith('YOUR_') || inputs.updateRepo.startsWith('YOUR_'))) {
    throw new Error('Auto update requires --update-owner and --update-repo with real GitHub values.')
  }
}

export function renderSetupSummary(inputs: ReturnType<typeof resolveStarterInitValues>) {
  const lines = [
    `Initialized ${inputs.displayName} (${inputs.appId}).`,
    `Enabled modules: ${inputs.initialEnabledModules.join(', ') || 'none'}.`,
  ]

  for (const moduleId of inputs.initialEnabledModules) {
    const manifest = starterModuleManifests[moduleId]
    lines.push(`${moduleId}: ${manifest.documentation}`)
  }

  if (inputs.initialEnabledModules.includes('autoUpdate')) {
    lines.push('Auto update setup: configure Windows code signing, add release workflow secrets, then run npm run validate:release before publishing a semver tag.')
  }

  return lines.join('\n')
}

async function main() {
  const partialInputs = process.argv.length > 2 ? parseInitArgs(process.argv.slice(2)) : await promptForInputs()
  const initInputs = resolveStarterInitValues(partialInputs)
  validateInitInputs(initInputs)
  const root = path.resolve(import.meta.dirname, '..', '..')
  const [packageJson, packageLockJson, electronBuilderJson, baseConfig] = await Promise.all([
    readFile(path.join(root, 'package.json'), 'utf8'),
    readFile(path.join(root, 'package-lock.json'), 'utf8'),
    readFile(path.join(root, 'electron-builder.json'), 'utf8'),
    readFile(path.join(root, 'config', 'base.ts'), 'utf8'),
  ])
  const result = applyStarterInit(
    { packageJson, packageLockJson, electronBuilderJson, baseConfig },
    initInputs,
    resolveStarterFeatureSelection(initInputs.initialEnabledModules),
  )

  await Promise.all([
    writeFile(path.join(root, 'package.json'), result.packageJson),
    writeFile(path.join(root, 'package-lock.json'), result.packageLockJson),
    writeFile(path.join(root, 'electron-builder.json'), result.electronBuilderJson),
    writeFile(path.join(root, 'config', 'base.ts'), result.baseConfig),
  ])
  output.write(`${renderSetupSummary(initInputs)}\n`)
}

const invokedPath = process.argv[1]
if (invokedPath && import.meta.url === pathToFileURL(path.resolve(invokedPath)).href) {
  void main().catch((error: unknown) => {
    output.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
