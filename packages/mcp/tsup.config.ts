import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    server: 'server/index.ts',
  },
  format: [
    'esm',
    'cjs',
  ],
  target: 'node20',
  dts: true,
  shims: true,
  splitting: false,
  sourcemap: true,
  treeshake: false,
  experimentalDts: true,
})
