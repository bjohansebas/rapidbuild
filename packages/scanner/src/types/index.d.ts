import type { BiomeConfig, ESLintConfig, PrettierConfig } from './configs'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun' | 'deno'

export type Languages = 'javascript' | 'typescript'

export type Linters = 'biome' | 'eslint' | 'oxc'
export type Formatters = 'biome' | 'prettier'

export interface Css {
  preprocessor: 'sass' | 'less' | 'stylus' | 'postcss'
  framework: 'tailwindcss' | 'bootstrap'
}

export type CI = 'github' | 'travis'

export interface Monorepo {
  name: 'turborepo' | 'nx'
}

export interface Project extends Package {
  packages?: Package[] | null
  package_manager: PackageManager[] | null
  // monorepo: null | Monorepo
  // ci: string
  // git_hooks: string
}

export interface Package {
  name?: string
  languages: Languages[] | null
  linters: Linters[] | null | { biome: BiomeConfig | null; eslint: ESLintConfig | null }
  formatter: Formatters[] | null | { biome: BiomeConfig | null; prettier: PrettierConfig | null }
  // css: string[]
  // frameworks: string[]
  // database: string
}

export interface PackageJson {
  path: string
  name?: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  prettier?: object
  eslintConfig?: object
}

export interface ConfigReport {
  root: string
  mode?: 'verbose' | 'quite'
  checkContent?: boolean
  checkDependencies?: boolean
}
