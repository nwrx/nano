import type { PresetOrFactory } from 'unocss'
import { presetUnshared } from '@unshared/unocss-preset'
import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss'
import { COLORS } from './utils/colors'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({ cdn: 'https://esm.sh/' }),
    presetUnshared() as PresetOrFactory,
  ],
  content: {
    pipeline: {
      include: [
        './**/*.ts',
        './**/*.vue',
      ],
      exclude: [
        '.nuxt',
        'node_modules',
        '.git',
      ],
    },
  },
  theme: {
    colors: COLORS,
    breakpoints: {
      sm: '786px',
      md: '1280px',
      lg: '1440px',
    },
    fontFamily: {
      sans: '"IBM Plex Sans", sans-serif',
      serif: '"IBM Plex Serif", serif',
      mono: '"Fira Code", monospace',
    },
    width: {
      container: '1440px',
    },
    maxWidth: {
      container: '1440px',
    },
  },
})
