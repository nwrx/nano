import type { Theme as ThemeUno } from 'unocss/preset-uno'
import { createColorPalette } from '@unshared/color/createColorPalette'
import { presetUnshared } from '@unshared/unocss-preset'
import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss'
import { presetTheme } from 'unocss-preset-theme'
import * as THEME from './theme'

const stops = [50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900, 910, 920, 930, 940, 950] as const
type STOPS = Array<typeof stops[number]>

export const COLORS = {
  primary: createColorPalette('#5636D9', { stepUp: 10, stepDown: 11, hueShift: 0, stops: stops as unknown as STOPS }),
  secondary: createColorPalette('#F59E0B', { stepUp: 9, stepDown: 10, hueShift: 50, stops: stops as unknown as STOPS }),
  danger: createColorPalette('#fb3618', { stepUp: 9, stepDown: 8, hueShift: 20 }),
  warning: createColorPalette('#f59e0b', { stepUp: 10, stepDown: 5, hueShift: 20 }),
  success: createColorPalette('#86bd25', { stepUp: 11, stepDown: 5, hueShift: 20 }),
}

type Theme = THEME.ThemeBadge & THEME.ThemeHint & THEME.ThemeInput & ThemeUno
export default defineConfig<Theme>({

  /**
   * Options for sources to be extracted as utilities usages. This allows
   * UnoCSS to automatically generate utilities based on the usage of each
   * CSS class in the source files.
   */
  content: {
    pipeline: {
      include: [
        './**/*.ts',
        './**/*.tsx',
        './**/*.vue',
      ],
      exclude: [
        '.nuxt',
        'node_modules',
        '.git',
      ],
    },
  },

  /**
   * Dynamic rules are rules that are generated based on the configuration
   * and the context of the CSS file. This allows you to create rules that
   * are based on the usage of the CSS classes in your source files.
   */
  rules: [
    THEME.ruleBadge,
    THEME.ruleHint,
    THEME.ruleInput,
  ],

  /**
   * Shortcuts are used to define a collection of classes that are regrouped
   * under a single name. This allows you to define a set of classes that
   * can be used to apply a specific style to an element.
   */
  shortcuts: {
    'v-enter-active': 'transition',
    'v-enter-from': 'transform opacity-0',
    'v-enter-to': 'transform opacity-100',
    'v-leave-active': 'transition',
    'v-leave-from': 'transform opacity-100',
    'v-leave-to': 'transform opacity-0',
  },

  /**
   * The theme object is used to define the colors, spacings, and other
   * design tokens that are used in the CSS utilities. The theme object
   * is also used to define the breakpoints, font families, and other
   * design tokens that are used in the CSS utilities.
   */
  theme: {
    colors: {
      ...COLORS,
      'app': COLORS.primary[50],
      'subtle': COLORS.primary[60],
      'emphasized': COLORS.primary[80],
      'prominent': COLORS.primary[100],

      // Layout
      'layout': COLORS.primary[900],
      'layout-subtle': COLORS.primary[850],
      'layout-emphasized': COLORS.primary[800],
      'layout-prominent': COLORS.primary[750],

      // Editor
      'editor': COLORS.primary[50],
      'editor-select': `${COLORS.primary[500]}20`,
      'editor-node': `${COLORS.primary[70]}80`,
      'editor-panel': `${COLORS.primary[70]}80`,
      'editor-panel-data': `${COLORS.primary[900]}10`,
    },

    textColor: {
      'danger': COLORS.danger[800],
      'warning': COLORS.warning[800],
      'success': COLORS.success[800],

      // App
      'app': COLORS.primary[900],
      'subtle': `${COLORS.primary[900]}80`,
      'emphasized': `${COLORS.primary[900]}C0`,
      'prominent': COLORS.primary[600],

      // Layout
      'layout': COLORS.primary[50],
      'layout-subtle': `${COLORS.primary[50]}80`,
      'layout-emphasized': `${COLORS.primary[50]}C0`,
      'layout-prominent': COLORS.primary[100],

      // Editor
      'editor-node': COLORS.primary[900],
    },

    borderColor: {
      'danger': `${COLORS.danger[800]}80`,
      'warning': COLORS.warning[800],
      'success': COLORS.success[800],

      // App
      'app': `${COLORS.primary[900]}20`,
      'subtle': `${COLORS.primary[500]}20`,
      'emphasized': `${COLORS.primary[500]}40`,
      'prominent': COLORS.primary[500],

      // Layout
      'layout': `${COLORS.primary[50]}20`,
      'layout-subtle': `${COLORS.primary[50]}20`,
      'layout-emphasized': `${COLORS.primary[50]}60`,
      'layout-prominent': `${COLORS.primary[50]}80`,

      // Editor
      'editor': `${COLORS.primary[900]}20`,
      'editor-select': COLORS.primary[500],
    },

    lineWidth: {
      DEFAULT: '1px',
      thick: '2px',
    },

    ringWidth: {
      DEFAULT: '1px',
      thick: '4px',
    },

    borderRadius: {
      DEFAULT: '0.25rem',
      card: '1rem',
      app: '1rem',
    },

    spacing: {
      'DEFAULT': '1rem',
      'xs': '0.25rem',
      'sm': '0.50rem',
      'md': '1rem',
      'lg': '2rem',
      'xl': '3rem',
      '2xl': '4rem',
    },

    breakpoints: {
      sm: '786px',
      md: '1280px',
      lg: '1440px',
    },

    maxWidth: {
      page: '1440px',
    },

    duration: {
      DEFAULT: '150ms',
      fast: '50ms',
      slow: '300ms',
    },

    fontFamily: {
      sans: '"IBM Plex Sans", sans-serif',
      serif: '"IBM Plex Serif", serif',
      mono: '"Fira Code", monospace',
    },

    // Input
    inputColor: {
      'DEFAULT': COLORS.primary[900],
      'hover': COLORS.primary[900],
      'focus': COLORS.primary[900],
      'error': COLORS.danger[600],
      'disabled': `${COLORS.primary[900]}C0`,
      'readonly': COLORS.primary[900],

      // Layout
      'layout': COLORS.primary[50],
      'layout-hover': COLORS.primary[50],
      'layout-focus': COLORS.primary[50],
    },
    inputBackground: {
      DEFAULT: 'transparent',
      hover: 'transparent',
      focus: `${COLORS.primary[500]}08`,
      error: COLORS.danger[50],
      disabled: `${COLORS.primary[900]}5`,
      readonly: 'transparent',

      // Layout
      layout: 'transparent',
    },
    inputBorder: {
      'DEFAULT': `${COLORS.primary[900]}40`,
      'hover': COLORS.primary[600],
      'focus': COLORS.primary[600],
      'error': COLORS.danger[600],
      'disabled': `${COLORS.primary[900]}10`,
      'readonly': `${COLORS.primary[900]}20`,

      // Layout
      'layout': `${COLORS.primary[50]}20`,
      'layout-hover': `${COLORS.primary[50]}80`,
      'layout-focus': COLORS.primary[50],

      // Editor
      'editor': `${COLORS.primary[900]}20`,
    },
    inputVariant: {
      DEFAULT: {
        fontSize: '0.875rem',
        borderRadius: '0.25rem',
        borderSize: '1px',
        paddingX: '0.75rem',
        paddingY: '0.5rem',
      },
      lg: {
        fontSize: '1.25rem',
        borderRadius: '0.25rem',
        borderSize: '1px',
        paddingX: '1.5rem',
        paddingY: '1rem',
      },
      sm: {
        fontSize: '0.875rem',
        borderRadius: '0.25rem',
        borderSize: '1px',
        paddingX: '0.75rem',
        paddingY: '0.25rem',
      },
    },

    // Badge
    badgeColor: {
      DEFAULT: {
        background: COLORS.primary[100],
        foreground: COLORS.primary[800],
        inverse: COLORS.primary[900],
      },
      primary: {
        background: COLORS.primary[600],
        foreground: COLORS.primary[50],
      },
      secondary: {
        foreground: COLORS.secondary[50],
        background: COLORS.secondary[500],
      },
      success: {
        foreground: COLORS.success[50],
        background: COLORS.success[500],
        inverse: COLORS.success[700],
      },
      danger: {
        foreground: COLORS.danger[50],
        background: COLORS.danger[500],
        inverse: COLORS.danger[700],
      },
      warning: {
        foreground: COLORS.warning[50],
        background: COLORS.warning[500],
        inverse: COLORS.warning[700],
      },
    },
    badgeSize: {
      DEFAULT: {
        height: '1.5rem',
        spacing: '0.5rem',
        fontSize: '0.860rem',
        fontWeight: '500',
        borderRadius: '0.25rem',
        borderSize: '1px',
      },
      lg: {
        height: '2.5rem',
        spacing: '1rem',
        fontWeight: '600',
        fontSize: '1.25rem',
        borderRadius: '0.25rem',
        borderSize: '2px',
      },
    },

    // Hint
    hintColor: {
      DEFAULT: COLORS.primary[900],
      primary: COLORS.primary[600],
      secondary: COLORS.secondary[600],
      success: COLORS.success[800],
      danger: COLORS.danger[600],
      warning: COLORS.warning[600],
    },
    hintBackground: {
      DEFAULT: COLORS.primary[50],
      primary: COLORS.primary[100],
      secondary: COLORS.secondary[100],
      success: COLORS.success[100],
      danger: COLORS.danger[100],
      warning: COLORS.warning[100],
    },
    hintOpacity: {
      DEFAULT: '0.2',
    },
    hintSize: {
      DEFAULT: {
        fontSize: '0.875rem',
        borderRadius: '0.25rem',
        borderSize: '1px',
        padding: '1rem',
      },
      lg: {
        fontSize: '1.25rem',
        borderRadius: '0.25rem',
        borderSize: '1px',
        padding: '1.5rem',
      },
    },
  },

  presets: [

    /**
     * The UnoCSS preset is the core of the UnoCSS engine. It provides
     * the core utilities and the preflight styles that are used to
     * normalize the styles across different browsers.
     */
    presetUno({
      preflight: true,
    }),

    /**
     * The UnoCSS Icons preset is used to provide the utilities for
     * adding icons to the HTML elements as SVG web-fonts.
     */
    presetIcons({
      cdn: 'https://esm.sh/',
    }),

    /**
     * The UnoCSS Typography preset is used to provide the utilities for
     * styling the typography of the application. Usually the output of
     * a markdown renderer is styled using these utilities.
     */
    presetTypography({
      compatibility: {
        noColonIs: true,
      },
    }),

    /**
     * The UnoCSS Theme preset is used to provide the utilities for
     * theming the application based on the theme object.
     */
    presetUnshared({}),
    presetTheme<Theme>({
      prefix: '--theme',
      theme: {
        dark: {
          colors: {
            'app': COLORS.primary[920],
            'subtle': COLORS.primary[900],
            'emphasized': COLORS.primary[850],
            'prominent': COLORS.primary[800],

            // Layout
            'layout': COLORS.primary[950],
            'layout-subtle': COLORS.primary[920],
            'layout-emphasized': COLORS.primary[900],
            'layout-prominent': COLORS.primary[850],

            // Editor
            'editor': COLORS.primary[930],
            'editor-select': `${COLORS.primary[500]}40`,
            'editor-node': `${COLORS.primary[850]}80`,
            'editor-panel': `${COLORS.primary[850]}80`,
            'editor-panel-data': `${COLORS.primary[400]}15`,
          },
          textColor: {
            'app': COLORS.primary[50],
            'subtle': `${COLORS.primary[50]}80`,
            'emphasized': `${COLORS.primary[50]}A0`,
            'prominent': COLORS.primary[100],

            // Layout
            'layout': COLORS.primary[50],
            'layout-subtle': `${COLORS.primary[50]}80`,
            'layout-emphasized': `${COLORS.primary[50]}C0`,
            'layout-prominent': COLORS.primary[100],

            // Editor
            'editor-node': COLORS.primary[50],
            'editor-node-label': COLORS.primary[50],
          },
          borderColor: {
            app: `${COLORS.primary[100]}20`,
            subtle: `${COLORS.primary[400]}80`,
            emphasized: `${COLORS.primary[300]}80`,
            prominent: COLORS.primary[500],

            // Editor
            editor: `${COLORS.primary[100]}10`,
          },

          // Input
          inputColor: {
            DEFAULT: COLORS.primary[50],
            hover: COLORS.primary[50],
            focus: COLORS.primary[50],
            error: COLORS.danger[50],
            disabled: `${COLORS.primary[50]}C0`,
            readonly: COLORS.primary[50],
          },
          inputBackground: {
            DEFAULT: 'transparent',
            hover: 'transparent',
            focus: `${COLORS.primary[500]}04`,
            error: COLORS.danger[800],
            disabled: `${COLORS.primary[400]}10`,
            readonly: 'transparent',
          },
          inputBorder: {
            DEFAULT: `${COLORS.primary[50]}20`,
            hover: `${COLORS.primary[50]}80`,
            focus: COLORS.primary[50],
            error: COLORS.danger[800],
            disabled: `${COLORS.primary[50]}10`,
            readonly: `${COLORS.primary[50]}20`,
          },

          // Hint
          hintColor: {
            DEFAULT: COLORS.primary[100],
            primary: COLORS.primary[400],
            secondary: COLORS.secondary[500],
            success: COLORS.success[500],
            danger: COLORS.danger[500],
            warning: COLORS.warning[500],
          },
          hintBackground: {
            DEFAULT: `${COLORS.primary[800]}10`,
            primary: `${COLORS.primary[600]}10`,
            secondary: `${COLORS.secondary[600]}10`,
            success: `${COLORS.success[800]}10`,
            danger: `${COLORS.danger[600]}10`,
            warning: `${COLORS.warning[600]}10`,
          },
        },
      },
    }),
  ],
})
