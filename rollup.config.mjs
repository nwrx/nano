import { defineConfig } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'

export default defineConfig([
  {
    input: './index.ts',
    external: source => !source.startsWith('.') && !source.startsWith('/'),
    plugins: [
      RollupEsbuild({
        define: { 'import.meta.vitest': 'false' },
        platform: 'node',
        target: 'esnext',
        sourceMap: true,
        treeShaking: true,
        minifySyntax: true,
        tsconfig: new URL('tsconfig.json', import.meta.url).pathname,
      }),
    ],
    output: [
      {
        format: 'es',
        sourcemap: true,
        file: './dist/index.mjs',
      },
      {
        format: 'cjs',
        sourcemap: true,
        file: './dist/index.cjs',
      },
    ],
  },
  {
    input: './index.ts',
    external: source => !source.startsWith('.') && !source.startsWith('/'),
    plugins: [
      RollupDts({
        respectExternal: true,
        compilerOptions: { strict: true },
        tsconfig: new URL('tsconfig.json', import.meta.url).pathname,
      }),
    ],
    output: {
      format: 'es',
      file: './dist/index.d.ts',
    },
  },
])
