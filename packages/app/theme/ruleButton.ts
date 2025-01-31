import type { DynamicRule } from 'unocss'
import type { CSSProperties } from 'vue'
import { colorToString } from '@unocss/rule-utils'
import { toCSSObject } from './utils'

export interface ThemeButton {
  buttonColor?: Record<string, string>
  buttonBackground?: Record<string, string>
  buttonBorderColor?: Record<string, string>
  buttonVariant?: Record<string, CSSProperties>
}

// --- Define button
export const ruleButton: DynamicRule<ThemeButton> = [
  /^button(?:-(.+))?$/,
  (match, context) => {
    const { theme } = context
    const [, b = 'DEFAULT'] = match
    const result: Record<string, string> = {}

    // --- Style.
    const variant = theme.buttonVariant?.[b]
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
        ...toCSSObject(variant),
      })
    }

    // --- Color.
    const color = theme.buttonColor?.[b]
    if (color) {
      Object.assign(result, {
        '--un-button-color': colorToString(color),
        'color': 'var(--un-button-color)',
        'border-color': 'var(--un-button-color)',
      })
    }

    // --- Background.
    const background = theme.buttonBackground?.[b]
    if (background) {
      Object.assign(result, {
        '--un-button-background': colorToString(background),
        'background-color': 'var(--un-button-background)',
      })
    }

    // --- Border.
    const border = theme.buttonBorderColor?.[b]
    if (border) {
      Object.assign(result, {
        '--un-button-border': colorToString(border),
        'border-color': 'var(--un-button-border)',
      })
    }

    // --- If matched, return the result
    return Object.keys(result).length > 0 ? result : undefined
  },
  {
    layer: 'components',
    autocomplete: [
      'button',
      'button-$buttonVariant',
      'button-$buttonColor',
      'button-$buttonBackground',
      'button-$buttonBorder',
    ],
  },
]
