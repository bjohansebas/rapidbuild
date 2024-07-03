import { describe, expect, it } from 'vitest'
import { generateReport } from '../../../src'
import { biomeFiles } from '../../../src/constants'

describe('report biome when exists file', () => {
  it.each(biomeFiles)("report biome when using '%s'", async (file) => {
    const report = await generateReport([file, 'data.json'])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')
  })

  it.each(biomeFiles)('report %s when it is in a subfolder', async (file) => {
    const report = await generateReport([`src/${file}`, 'index.ts'])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')

    const report2 = await generateReport([`packages/config/${file}`, 'index.ts'])

    expect(report2.linters).toHaveLength(1)
    expect(report2.linters).toContain('biome')
    expect(report2.linters).not.toContain('eslint')
  })

  it("do not report biome when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport(['src/lbiome.json', 'index.ts'])

    expect(report.linters).toBe(null)
  })
})