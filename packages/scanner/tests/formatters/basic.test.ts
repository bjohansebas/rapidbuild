import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('formatters in root package', () => {
  it("do not display any formatter if there isn't any", async () => {
    const report = await generateReport(['src/index.ts', 'index.ts', 'index.test.ts'])

    expect(report.formatter).toBe(null)
  })
})

describe('formatters in packages', () => {
  it('formatters in differents packages', async () => {
    const report = await generateReport([
      'package.json',
      'biome.json',
      'packages/ui/package.json',
      'packages/ui/.prettierrc',
    ])

    expect(report.formatter).toEqual(['biome'])
    expect(report.formatter).toHaveLength(1)

    expect(report.packages).toHaveLength(1)
    if (!report.packages) {
      throw new Error('Packages is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.formatter).toHaveLength(1)

      expect(packageReport.formatter).toContain('prettier')
    }
  })

  it("do not display any formatter if there isn't any", async () => {
    const report = await generateReport([
      'package.json',
      'index.js',
      'package/ui/cbiome.json',
      'package/ui/llbiome.jsonc',
      'package/ui/package.json',
      'package/ui/index.ts',
    ])

    expect(report.formatter).toBe(null)
    expect(report.linters).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Packages is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.linters).toBe(null)
    }
  })
})
