import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    server: 'server.ts',
  },
  format: [
    'esm',
  ],
  target: 'node22',
  platform: 'node',
  shims: true,
  minify: false,
  treeshake: true,
  splitting: true,
  sourcemap: true,
  external: [/^@nwrx\/.*/],
  outExtension: () => ({ js: '.mjs' }),
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
