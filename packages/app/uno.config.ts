import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'
import { presetUnshared } from '@unshared/unocss-preset'
import * as COLORS from './utils/colors'

const FONT_SANS = 'IBM Plex Sans'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({ cdn: 'https://esm.sh/' }),
    presetUnshared(),

    presetWebFonts({
      fonts: {
        sans: [FONT_SANS],
      },
    }),
  ],

  content: {
    pipeline: {
      include: [
        './**/*',
        '../@nuxt/**/*',
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
      sans: 'sans, sans-serif',
    },
    width: {
      page: '1440px',
    },
  },
})
