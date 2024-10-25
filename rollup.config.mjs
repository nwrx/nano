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
        dir: './dist',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
      },
      {
        dir: './dist',
        format: 'commonjs',
        exports: 'named',
        sourcemap: true,
        entryFileNames: '[name].cjs',
        assetFileNames: 'assets/[name].cjs',
        chunkFileNames: 'chunks/[hash].cjs',
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
      dir: './dist',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].d.ts',
      assetFileNames: 'assets/[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
    },
  },
])
