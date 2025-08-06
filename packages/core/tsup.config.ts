import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    components: 'components/index.ts',
    sandbox: 'sandbox/index.ts',
    utils: 'utils/index.ts',
    index: 'index.ts',
  },
  format: [
    'esm',
  ],
  target: 'es2023',
  platform: 'node',
  dts: true,
  shims: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
})
