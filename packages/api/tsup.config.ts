import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    server: 'server.ts',
  },
  format: [
    'cjs',
  ],
  clean: true,
  minify: false,
  treeshake: false,
  splitting: false,
  sourcemap: true,
  outExtension: () => ({ js: '.cjs' }),
})
