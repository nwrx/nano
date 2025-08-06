import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    embeddings: 'embeddings/index.ts',
    image: 'image/index.ts',
    providers: 'providers/index.ts',
    models: 'models/index.ts',
    chat: 'chat/index.ts',
    speech: 'speech/index.ts',
    transcript: 'transcript/index.ts',
    utils: 'utils/index.ts',
  },
  format: [
    'esm',
    'cjs',
  ],
  target: 'node22',
  platform: 'node',
  dts: true,
  shims: false,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
