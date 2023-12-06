export type FormatterTools = 'biome' | 'prettier' | null
export type FormatterToolsExtension = 'esbenp.prettier-vscode' | 'biomejs.biome'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export type Languages = 'javascript' | 'typescript'

export type LinterTools = 'biome' | 'eslint' | null

export interface VSCodeConfig {
  extensions: boolean
  settings: boolean
}

export interface ConfigApp {
  appPath: string
  linter: LinterTools
  language: Languages
  formatter: FormatterTools
  packageManager: PackageManager
  vscode: VSCodeConfig
}

export type VSCodeSettings = {
  'editor.defaultFormatter'?: FormatterToolsExtension
  'editor.formatOnSave': boolean
  'editor.codeActionsOnSave'?: {
    'source.organizeImports.biome'?: boolean
    'quickfix.biome'?: boolean
  }
}
