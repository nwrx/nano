import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    server: 'server.ts',
  },
  format: [
    'cjs',
  ],
  target: 'node22',
  platform: 'node',
  shims: true,
  minify: true,
  treeshake: true,
  splitting: false,
  sourcemap: true,
  external: [/^@nwrx\/.*/],
  outExtension: () => ({ js: '.cjs' }),
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
