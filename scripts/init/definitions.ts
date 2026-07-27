import type {
  StarterInitInputDefinition,
  StarterModuleOption,
} from './types'

export const starterModuleOptions: StarterModuleOption[] = [
  {
    id: 'i18n',
    label: 'i18n',
    description: 'Enable JSON namespace translations and language switching.',
  },
  {
    id: 'autoUpdate',
    label: 'auto update',
    description: 'Enable the GitHub Releases update module for production builds.',
  },
  {
    id: 'appProtection',
    label: 'app protection',
    description: 'Enable production security enforcement hooks and policy gates.',
  },
  {
    id: 'licensing',
    label: 'licensing',
    description: 'Enable the typed licensing module and provider integration.',
  },
  {
    id: 'database',
    label: 'database',
    description: 'Enable the main-process Drizzle and SQLite database module.',
  },
  {
    id: 'logging',
    label: 'logging',
    description: 'Enable structured main-process logging helpers by default.',
  },
]

export const starterInitInputDefinitions: StarterInitInputDefinition[] = [
  {
    key: 'appName',
    label: 'App name',
    description: 'Internal application name used in starter config values.',
    required: true,
    kind: 'text',
    defaultValue: 'electron-starter',
  },
  {
    key: 'appId',
    label: 'App ID',
    description: 'Electron Builder application identifier, usually reverse-DNS.',
    required: true,
    kind: 'text',
    defaultValue: 'com.example.electronstarter',
  },
  {
    key: 'packageName',
    label: 'Package name',
    description: 'NPM package name for the generated project.',
    required: true,
    kind: 'text',
    defaultValue: 'electron-starter',
  },
  {
    key: 'displayName',
    label: 'Display name',
    description: 'Human-readable product name shown in the desktop app.',
    required: true,
    kind: 'text',
    defaultValue: 'Electron Starter',
  },
  {
    key: 'defaultLanguage',
    label: 'Default language',
    description: 'Initial language for projects that enable i18n.',
    required: true,
    kind: 'text',
    defaultValue: 'ro',
  },
  {
    key: 'updateOwner',
    label: 'GitHub owner',
    description: 'GitHub organization or user that owns release repository.',
    required: true,
    kind: 'text',
    defaultValue: 'YOUR_GITHUB_OWNER',
  },
  {
    key: 'updateRepo',
    label: 'GitHub repository',
    description: 'GitHub repository used for releases and optional updates.',
    required: true,
    kind: 'text',
    defaultValue: 'YOUR_RELEASE_REPO',
  },
  {
    key: 'updateVisibility',
    label: 'GitHub visibility',
    description: 'Visibility of the release repository.',
    required: true,
    kind: 'text',
    defaultValue: 'public',
  },
  {
    key: 'initialEnabledModules',
    label: 'Initial modules',
    description: 'Feature modules to enable in the generated starter config.',
    required: true,
    kind: 'module-multiselect',
    defaultValue: ['logging'],
  },
]
