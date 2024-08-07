import { biomeFiles } from '@/constants'
import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('report biome in root package', () => {
  it.each(biomeFiles)("report biome when using '%s'", async (file) => {
    const report = await generateReport([file, 'data.json'])

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('biome')
    expect(report.formatter).not.toContain('prettier')

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')
  })

  it.each(biomeFiles)('report %s when it is in a subfolder', async (file) => {
    const report = await generateReport([`src/${file}`, 'index.ts'])

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('biome')
    expect(report.formatter).not.toContain('prettier')

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')

    const report2 = await generateReport([`packages/config/${file}`, 'index.ts'])

    expect(report2.formatter).toHaveLength(1)
    expect(report2.formatter).toContain('biome')
    expect(report2.formatter).not.toContain('prettier')

    expect(report2.linters).toHaveLength(1)
    expect(report2.linters).toContain('biome')
    expect(report2.linters).not.toContain('eslint')
  })

  it("do not report biome when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport(['src/lbiome.json', 'index.ts'])

    expect(report.formatter).toBe(null)
    expect(report.linters).toBe(null)
  })
})

describe('report biome in packages with default config', () => {
  it.each(biomeFiles)("report biome when using '%s'", async (file) => {
    const report = await generateReport(['package.json', 'index.ts', 'package/cli/package.json', `package/cli/${file}`])

    expect(report.formatter).toBe(null)
    expect(report.linters).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.formatter).toHaveLength(1)
      expect(packageReport.formatter).not.toContain('prettier')
      expect(packageReport.formatter).toContain('biome')

      expect(packageReport.linters).toHaveLength(1)
      expect(packageReport.linters).toContain('biome')
    }
  })

  it("do not report biome when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport([
      'package.json',
      'index.js',
      'package/ui/lbiome.json',
      'package/ui/package.json',
      'package/ui/index.ts',
    ])

    expect(report.formatter).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.formatter).toBe(null)
      expect(packageReport.linters).toBe(null)
    }
  })
})
