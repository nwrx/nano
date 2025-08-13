import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'server': 'server.ts',
    'createThreadWorker.worker': 'worker/createThreadWorker.worker.mjs',
    'getWorkerPoolStatus.worker': 'worker/getWorkerPoolStatus.worker.mjs',
  },
  format: [
    'esm',
  ],
  clean: true,
  minify: false,
  treeshake: true,
  splitting: true,
  sourcemap: true,
  outExtension: () => ({ js: '.mjs' }),
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
