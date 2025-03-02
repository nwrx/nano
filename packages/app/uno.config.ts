import type { Theme as ThemeUno } from 'unocss/preset-uno'
import { presetUnshared } from '@unshared/unocss-preset'
import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss'
import { presetTheme } from 'unocss-preset-theme'
import * as THEME from './theme'
import { COLORS } from './utils/constants'

type Theme =
  & THEME.ThemeBadge
  & THEME.ThemeButton
  & THEME.ThemeHint
  & THEME.ThemeHyperlink
  & THEME.ThemeInput
  & THEME.ThemeTab
  & ThemeUno

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
    THEME.ruleButton,
    THEME.ruleLink,
    THEME.ruleTab,
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

    'slide-enter-active': 'transition',
    'slide-enter-from': 'transform opacity-0 translate-y-2',
    'slide-enter-to': 'transform opacity-100 translate-y-0',
    'slide-leave-active': 'transition',
    'slide-leave-from': 'transform opacity-100 translate-y-0',
    'slide-leave-to': 'transform opacity-0 translate-y-2',
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
      'active': COLORS.primary[900],

      // Layout
      'layout': COLORS.primary[900],
      'layout-subtle': COLORS.primary[850],
      'layout-emphasized': COLORS.primary[800],
      'layout-prominent': COLORS.primary[750],

      // Editor
      'editor': COLORS.primary[50],
      'editor-select': `${COLORS.primary[500]}20`,
      'editor-active': COLORS.primary[500],

      'editor-node': `${COLORS.primary[100]}80`,
      'editor-panel': `${COLORS.primary[70]}80`,
      'editor-panel-data': `${COLORS.primary[900]}10`,
    },

    textColor: {
      'danger': COLORS.danger[500],
      'warning': COLORS.warning[500],
      'success': COLORS.success[500],
      'primary': COLORS.primary[900],

      // App
      'app': COLORS.primary[900],
      'subtle': `${COLORS.primary[900]}80`,
      'emphasized': `${COLORS.primary[900]}C0`,
      'prominent': COLORS.primary[600],
      'active': COLORS.primary[50],

      // Layout
      'layout': COLORS.primary[50],
      'layout-subtle': `${COLORS.primary[50]}80`,
      'layout-emphasized': `${COLORS.primary[50]}C0`,
      'layout-prominent': COLORS.primary[100],

      // Editor
      'editor-node': COLORS.primary[900],
      'editor-active': COLORS.primary[50],
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
      'editor-active': COLORS.primary[500],
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
      thread: '1024px',
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

    badgeVariant: {
      DEFAULT: {
        height: '1.5rem',
        fontSize: '0.875rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        fontWeight: '500',
        borderWidth: '1px',
        borderRadius: '0.25rem',
      },
      sm: {
        height: '1.25rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderWidth: '1px',
        borderRadius: '0.25rem',
      },
      lg: {
        height: '2.5rem',
        fontWeight: '600',
        fontSize: '1.25rem',
        borderWidth: '2px',
        borderRadius: '0.25rem',
      },
    },
    badgeColor: {
      DEFAULT: COLORS.primary[900],
      primary: COLORS.primary[600],
      secondary: COLORS.secondary[500],
      success: COLORS.success[600],
      danger: COLORS.danger[600],
      warning: COLORS.warning[900],
    },
    badgeBorderColor: {
      DEFAULT: COLORS.primary[100],
      primary: COLORS.primary[200],
      secondary: COLORS.secondary[200],
      success: COLORS.success[200],
      danger: COLORS.danger[200],
      warning: COLORS.warning[500],
    },
    badgeBackgroundColor: {
      DEFAULT: COLORS.primary[100],
      primary: COLORS.primary[100],
      secondary: COLORS.secondary[200],
      success: COLORS.success[200],
      danger: COLORS.danger[200],
      warning: COLORS.warning[200],
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

    // Button
    buttonColor: {
      DEFAULT: COLORS.primary[900],
      primary: COLORS.primary[600],
      secondary: COLORS.secondary[500],
      success: COLORS.success[800],
      danger: COLORS.danger[50],
      warning: COLORS.warning[500],
    },
    buttonBackground: {
      DEFAULT: COLORS.primary[100],
      primary: COLORS.primary[100],
      secondary: COLORS.secondary[200],
      success: COLORS.success[300],
      danger: COLORS.danger[400],
      warning: COLORS.warning[200],
    },
    buttonBorderColor: {
      DEFAULT: COLORS.primary[100],
      primary: COLORS.primary[200],
      secondary: COLORS.secondary[200],
      success: COLORS.success[300],
      danger: COLORS.danger[400],
      warning: COLORS.warning[500],
    },
    buttonVariant: {
      DEFAULT: {
        fontSize: '0.875rem',
        borderRadius: '0.25rem',
        borderWidth: '1px',
        paddingLeft: '0.50rem',
        paddingRight: '0.50rem',
        paddingTop: '0.375rem',
        paddingBottom: '0.375rem',
        opacity: '0.8',
      },
      hover: {
        opacity: '1',
      },
      lg: {
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: '0.25rem',
        borderWidth: '1px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
      },
    },

    // Link
    hyperlinkColor: {
      DEFAULT: COLORS.primary[800],
      primary: COLORS.primary[600],
    },
    hyperlinkVariant: {
      DEFAULT: {
        textDecoration: 'none',
        opacity: '0.8',
        cursor: 'pointer',
      },
      hover: {
        textDecoration: 'underline',
        opacity: '1',
      },
    },

    // Tab
    tabColor: {
      DEFAULT: `${COLORS.primary[900]}80`,
      hover: COLORS.primary[900],
      active: COLORS.primary[50],
      inactive: `${COLORS.primary[900]}80`,
    },
    tabBackground: {
      DEFAULT: 'transparent',
      hover: 'transparent',
      active: COLORS.primary[900],
      inactive: 'transparent',
    },
    tabBorderColor: {
      DEFAULT: 'transparent',
      hover: COLORS.primary[900],
      active: 'transparent',
      inactive: 'transparent',
    },
    tabVariant: {
      DEFAULT: {
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        borderWidth: '1px',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
      },
      lg: {
        fontSize: '1rem',
        borderWidth: '1px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
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
            'active': COLORS.primary[50],

            // Layout
            'layout': COLORS.primary[950],
            'layout-subtle': COLORS.primary[920],
            'layout-emphasized': COLORS.primary[900],
            'layout-prominent': COLORS.primary[850],

            // Editor
            'editor': COLORS.primary[930],
            'editor-select': `${COLORS.primary[500]}40`,
            'editor-active': COLORS.primary[700],

            'editor-node': `${COLORS.primary[850]}80`,
            'editor-panel': `${COLORS.primary[850]}80`,
            'editor-panel-data': `${COLORS.primary[400]}15`,
          },
          textColor: {
            'app': COLORS.primary[50],
            'subtle': `${COLORS.primary[50]}80`,
            'emphasized': `${COLORS.primary[50]}A0`,
            'prominent': COLORS.primary[100],
            'active': COLORS.primary[900],

            // Layout
            'layout': COLORS.primary[50],
            'layout-subtle': `${COLORS.primary[50]}80`,
            'layout-emphasized': `${COLORS.primary[50]}C0`,
            'layout-prominent': COLORS.primary[100],

            // Editor
            'editor-node': COLORS.primary[50],
            'editor-active': COLORS.primary[50],
          },
          borderColor: {
            'app': `${COLORS.primary[100]}20`,
            'subtle': `${COLORS.primary[400]}80`,
            'emphasized': `${COLORS.primary[300]}80`,
            'prominent': COLORS.primary[500],

            // Editor
            'editor': `${COLORS.primary[100]}20`,
            'editor-active': COLORS.primary[50],
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

          // Badge
          badgeColor: {
            DEFAULT: COLORS.primary[50],
            primary: COLORS.primary[50],
            secondary: COLORS.secondary[50],
            success: COLORS.success[500],
            danger: COLORS.danger[50],
            warning: COLORS.warning[500],
          },
          badgeBorderColor: {
            DEFAULT: COLORS.primary[800],
            primary: COLORS.primary[600],
            secondary: COLORS.secondary[500],
            success: COLORS.success[500],
            danger: COLORS.danger[500],
            warning: COLORS.warning[500],
          },
          badgeBackgroundColor: {
            DEFAULT: COLORS.primary[700],
            primary: COLORS.primary[500],
            secondary: COLORS.secondary[500],
            success: 'transparent',
            danger: COLORS.danger[500],
            warning: 'transparent',
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

          // Button
          buttonColor: {
            DEFAULT: COLORS.primary[50],
            primary: COLORS.primary[50],
            secondary: COLORS.secondary[50],
            success: COLORS.success[400],
            danger: COLORS.danger[400],
            warning: COLORS.warning[400],
          },
          buttonBackground: {
            DEFAULT: COLORS.primary[700],
            primary: COLORS.primary[500],
            secondary: COLORS.secondary[500],
            success: `${COLORS.success[500]}40`,
            danger: `${COLORS.danger[500]}20`,
            warning: `${COLORS.warning[500]}40`,
          },
          buttonBorderColor: {
            DEFAULT: COLORS.primary[800],
            primary: COLORS.primary[600],
            secondary: COLORS.secondary[500],
            success: COLORS.success[500],
            danger: COLORS.danger[500],
            warning: COLORS.warning[500],
          },

          // Link
          hyperlinkColor: {
            DEFAULT: COLORS.primary[50],
            primary: COLORS.primary[400],
          },

          // Tab
          tabColor: {
            DEFAULT: `${COLORS.primary[50]}80`,
            hover: COLORS.primary[50],
            active: COLORS.primary[900],
            inactive: `${COLORS.primary[50]}80`,
          },
          tabBackground: {
            DEFAULT: 'transparent',
            hover: 'transparent',
            active: `${COLORS.primary[50]}FF`,
            inactive: 'transparent',
          },
          tabBorderColor: {
            DEFAULT: 'transparent',
            hover: COLORS.primary[50],
            active: 'transparent',
            inactive: 'transparent',
          },
        },
      },
    }),
  ],
})
