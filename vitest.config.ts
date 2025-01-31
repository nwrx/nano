import { cpus } from 'node:os'
import { defineConfig } from 'vitest/config'

const exclude = [
  '**/node_modules/**',
  '**/index.ts',
  '**/__wip__',
  '**/dist',
  '**/*.d.ts',
  'eslint.config.mjs',
  'forcePnpm.js',
  'vitest.config.ts',
]

export default defineConfig({
  test: {
    exclude,
    globals: true,
    include: ['./packages/**/*.test.ts'],
    reporters: [['default', { summary: false }]],
    setupFiles: './packages/setupTest.ts',
    testTimeout: 100,
    isolate: true,

    // --- Worker pool configuration.
    pool: 'forks',
    maxConcurrency: cpus().length,
    poolOptions: {
      forks: {
        maxForks: cpus().length,
        minForks: cpus().length,
      },
    },

    // --- Benchmark configuration.
    benchmark: {
      exclude,
      outputFile: './benchmark/results.json',
      reporters: ['verbose'],
    },

    // --- V8 coverage configuration.
    coverage: {
      clean: true,
      cleanOnRerun: true,
      enabled: false,
      reporter: ['lcovonly', 'html-spa', 'text'],
      exclude: [...exclude, './packages/app'],
      reportOnFailure: true,
      reportsDirectory: './.coverage',
    },

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      enabled: false,
      exclude,
      ignoreSourceErrors: true,
    },
  },
})
