import path from 'node:path'

import { findPackageJson } from '@/helpers'
import { generatePackages } from '@/helpers/generate-packages'
import { readPackageJson } from '@/utils/package'
import { describe, expect, it } from 'vitest'

const root = `${process.cwd()}/tests/packages`

describe('find package json', () => {
  it('contain many packages without package.json', async () => {
    const packages = findPackageJson(['package/ui/index.ts', 'package/cli/index.ts', 'package/cli/src/ui.ts'])

    expect(packages).toHaveLength(0)
  })

  it('should return correct paths for multiple package.json files in different directories', async () => {
    const packages = findPackageJson([
      'package/ui/index.ts',
      'package/ui/package.json',
      'package/cli/package.json',
      'package/cli/index.ts',
      'package/cli/src/ui.ts',
      'package/utils/package.json',
      'package/cli/src/index.js',
    ])

    expect(packages).toHaveLength(3)
  })

  it('should handle empty file list without errors', () => {
    const result = findPackageJson([])

    expect(result).toHaveLength(0)
  })

  it('should return correct paths for package.json files with unusual characters or spaces', () => {
    const files = ['project 1/package.json', 'project$2/package.json', 'project#3/sub dir/package.json']
    const result = findPackageJson(files)

    const expected = [path.resolve('project 1'), path.resolve('project$2'), path.resolve('project#3/sub dir')]

    expect(result).toEqual(expected)
    expect(result).toHaveLength(3)
  })

  it('should filter out files with similar names but different extensions', () => {
    const files = [
      'project1/package.json',
      'project#2/package.json',
      'project3/package.json5',
      'project4/package.json.txt',
    ]
    const result = findPackageJson(files)

    const expected = [path.resolve('project1'), path.resolve('project#2')]

    expect(result).toEqual(expected)
    expect(result).toHaveLength(2)
  })

  it('should return correct paths for package.json files with environment variables', () => {
    const files = ['$HOME/project1/package.json', '$USER/project2/package.json', '$ROOT/subdir/package.json']
    const expected = [path.resolve('$HOME/project1'), path.resolve('$USER/project2'), path.resolve('$ROOT/subdir')]

    const result = findPackageJson(files)
    expect(result).toEqual(expected)
    expect(result).toHaveLength(3)
  })
})

describe('generate packages with files', () => {
  it('should return an empty array when files array is empty', () => {
    const result = generatePackages([])

    expect(result).toEqual([])
  })

  // correctly groups files by package names derived from package.json files
  it('should correctly group files by package names derived from package.json files', () => {
    const files = [
      'package1/package.json',
      'package1/file1.js',
      'package1/file3.js',
      'package2/package.json',
      'package2/file2.js',
    ]

    const result = generatePackages(files)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ path: 'package2', files: ['package2/package.json', 'package2/file2.js'] })
    expect(result).toContainEqual({
      path: 'package1',
      files: ['package1/package.json', 'package1/file1.js', 'package1/file3.js'],
    })
  })

  it('should process files with no matching package names', () => {
    const files = ['file1.js', 'file2.js', 'file3.js']

    const result = generatePackages(files)

    expect(result).toHaveLength(1)
    expect(result).toEqual([{ path: '.', files: ['file1.js', 'file2.js', 'file3.js'] }])
  })

  it('should correctly group files by package names derived from package.json files', () => {
    const files = [
      'package1/package.json',
      'package1/file1.js',
      'package1/file3.js',
      'package2/package.json',
      'package2/file2.js',
    ]

    const result = generatePackages(files)

    expect(result).toEqual([
      { path: 'package1', files: ['package1/package.json', 'package1/file1.js', 'package1/file3.js'] },
      { path: 'package2', files: ['package2/package.json', 'package2/file2.js'] },
    ])
  })

  it('should handle files with special characters in their names', () => {
    const files = [
      'package1/file@1.js',
      'package.json',
      'index.js',
      'package2/package.json',
      'package2/fi!le2.js',
      'package1/file#3.js',
      'package1/package.json',
    ]

    const result = generatePackages(files)

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      { path: 'package1', files: ['package1/file@1.js', 'package1/file#3.js', 'package1/package.json'] },
      { path: '.', files: ['package.json', 'index.js'] },
      { path: 'package2', files: ['package2/package.json', 'package2/fi!le2.js'] },
    ])
  })

  it('should handle large number of files efficiently', () => {
    const files = Array.from({ length: 10000 }, (_, i) => {
      if (i % 2 !== 0) {
        return `package${i - 1}/index.js`
      }
      return `package${i}/package.json`
    })

    const result = generatePackages(files)

    expect(result.length).toBe(5000)
    expect(result[0].path).toBe('package0')
    expect(result[0].files.length).toBe(2)
    expect(result[4999].path).toBe('package9998')
    expect(result[4999].files.length).toBe(2)
  })
})

describe('read package.json', async () => {
  it('should return null when no package.json is found in files array', async () => {
    const files = ['src/index.js', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result).toBeNull()
  })

  it('should return a PackageJson object with dependencies when package.json is found', async () => {
    const files = ['src/index.js', 'package.json', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result?.dependencies).not.toBeUndefined()
    expect(result?.dependencies).toEqual({
      'fast-glob': '3.3.2',
      'object.groupby': '1.0.3',
      'parse-gitignore': '2.0.0',
    })
  })

  it('should return a PackageJson object with devDependencies when package.json is found', async () => {
    const files = ['src/index.js', 'package.json', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result?.devDependencies).not.toBeUndefined()
    expect(result?.devDependencies).toEqual({
      '@rapidapp/config': 'workspace:*',
      '@types/node': '20.14.10',
      '@types/object.groupby': '1.0.4',
      '@types/parse-gitignore': '1.0.2',
      tsup: '8.1.0',
      typescript: '5.5.3',
      vitest: '2.0.2',
    })
  })

  it('should return a PackageJson object with prettier when package.json is found', async () => {
    const files = ['src/index.js', 'package.json', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result?.prettier).not.toBeUndefined()
    expect(result?.prettier).toEqual({
      endOfLine: 'auto',
    })
  })

  it('should return a PackageJson object with eslintConfig when package.json is found', async () => {
    const files = ['src/index.js', 'package.json', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result?.eslintConfig).not.toBeUndefined()
    expect(result?.eslintConfig).toEqual({
      env: { browser: true },
    })
  })

  it('should return a PackageJson object with scripts when package.json is found', async () => {
    const files = ['src/index.js', 'package.json', 'README.md']
    const result = await readPackageJson(files, root)

    expect(result?.scripts).not.toBeUndefined()
    expect(result?.scripts).toEqual({
      clean: 'node ../../scripts/rm.mjs dist',
      dev: 'tsup --watch',
      build: 'tsup',
      prepublishOnly: 'cd ../../ && turbo run build',
      test: 'vitest',
    })
  })

  it('should return a PackageJson object with only path when package.json is found without optional fields', async () => {
    const files = ['src/index.js', 'optionalFields/package.json', 'README.md']

    const result = await readPackageJson(files, root)
    expect(result).toEqual({
      path: 'optionalFields/package.json',
    })
  })
})
