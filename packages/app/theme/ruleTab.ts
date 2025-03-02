import type { DynamicRule } from 'unocss'
import type { CSSProperties } from 'vue'
import { colorToString } from '@unocss/rule-utils'
import { toCSSObject } from './utils'

export interface ThemeTab {
  tabColor?: Record<string, string>
  tabBackground?: Record<string, string>
  tabBorderColor?: Record<string, string>
  tabVariant?: Record<string, CSSProperties>
}

// --- Define tab
export const ruleTab: DynamicRule<ThemeTab> = [
  /^tab(?:-(.+))?$/,
  (match, context) => {
    const { theme } = context
    const [, t = 'DEFAULT'] = match
    const result: Record<string, string> = {}

    // --- Style.
    const variant = theme.tabVariant?.[t]
    if (variant) {
      Object.assign(result, {
        'display': 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        'white-space': 'nowrap',
        'outline': 'none',
        'cursor': 'pointer',
        'user-select': 'none',
        'text-align': 'center',
        'transition': 'all 150ms ease',
        ...toCSSObject(variant),
      })
    }

    // --- Color.
    const color = theme.tabColor?.[t]
    if (color) {
      Object.assign(result, {
        '--un-tab-color': colorToString(color),
        'color': 'var(--un-tab-color)',
      })
    }

    // --- Background.
    const background = theme.tabBackground?.[t]
    if (background) {
      Object.assign(result, {
        '--un-tab-background': colorToString(background),
        'background-color': 'var(--un-tab-background)',
      })
    }

    // --- Border.
    const border = theme.tabBorderColor?.[t]
    if (border) {
      Object.assign(result, {
        '--un-tab-border': colorToString(border),
        'border-color': 'var(--un-tab-border)',
      })
    }

    // --- If matched, return the result
    return Object.keys(result).length > 0 ? result : undefined
  },
  {
    layer: 'components',
    autocomplete: [
      'tab',
      'tab-$tabVariant',
      'tab-$tabColor',
      'tab-$tabBackground',
      'tab-$tabBorder',
    ],
  },
]
