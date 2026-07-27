import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { applyStarterInit } from './applyStarterInit'
import { starterModuleManifests } from './modules'
import { resolveStarterFeatureSelection } from './index'
import { resolveStarterInitValues, type StarterInitPartialInputValues } from './transform'
import { starterModuleIds, type StarterModuleId } from './types'

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
    const appName = await prompt.question('App name: ')
    const packageName = await prompt.question(`Package name [${appName || 'electron-starter'}]: `)
    const displayName = await prompt.question(`Display name [${appName || packageName || 'Electron Starter'}]: `)
    const appId = await prompt.question('App ID (reverse DNS, optional): ')
    const modules = await prompt.question(`Modules (${starterModuleIds.join(', ')}) [logging]: `)
    const selectedModules = parseModules(modules || 'logging')
    const defaultLanguage = await prompt.question('Default language (en, ro, ru) [ro]: ')

    let updateOwner: string | undefined
    let updateRepo: string | undefined
    let updateVisibility: 'public' | 'private' | undefined
    if (selectedModules.includes('autoUpdate')) {
      updateOwner = await prompt.question('GitHub owner: ')
      updateRepo = await prompt.question('GitHub repository: ')
      updateVisibility = (await prompt.question('Repository visibility (public/private) [public]: ') || 'public') as 'public' | 'private'
    }

    return {
      appName: appName || undefined,
      appId: appId || undefined,
      packageName: packageName || undefined,
      displayName: displayName || undefined,
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
  const [packageJson, electronBuilderJson, baseConfig] = await Promise.all([
    readFile(path.join(root, 'package.json'), 'utf8'),
    readFile(path.join(root, 'electron-builder.json'), 'utf8'),
    readFile(path.join(root, 'config', 'base.ts'), 'utf8'),
  ])
  const result = applyStarterInit(
    { packageJson, electronBuilderJson, baseConfig },
    initInputs,
    resolveStarterFeatureSelection(initInputs.initialEnabledModules),
  )

  await Promise.all([
    writeFile(path.join(root, 'package.json'), result.packageJson),
    writeFile(path.join(root, 'electron-builder.json'), result.electronBuilderJson),
    writeFile(path.join(root, 'config', 'base.ts'), result.baseConfig),
  ])
  output.write(`${renderSetupSummary(initInputs)}\n`)
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  void main().catch((error: unknown) => {
    output.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
