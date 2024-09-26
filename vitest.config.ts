import { resolvePackageNames } from '@unshared/scripts'
import { cpus } from 'node:os'
import { defineConfig } from 'vitest/config'

const packageNames = await resolvePackageNames()
const includeSource = packageNames.map(name => `./packages/${name}/**/*.ts`)
const include = packageNames.map(name => `./packages/${name}/**/*.test.ts`)

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
    include,
    includeSource,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    testTimeout: process.env.DEBUGGER ? 100 : 0,
    isolate: true,
    pool: 'threads',
    maxConcurrency: cpus().length,
    poolOptions: {
      threads: {
        useAtomics: true,
        maxThreads: cpus().length,
        minThreads: cpus().length,
      },
      forks: {
        maxForks: cpus().length,
        minForks: cpus().length,
      },
    },

    // --- Benchmark configuration.
    benchmark: {
      exclude,
      includeSource,
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
      include: includeSource,
    },
  },
})
