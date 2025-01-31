import type { DynamicRule } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { colorToString } from '@unocss/rule-utils'

export interface ThemeInput {
  inputColor?: Record<string, string>
  inputBorder?: Record<string, string>
  inputBackground?: Record<string, string>
  inputVariant?: Record<string, {
    fontSize?: string
    borderStyle?: string
    borderRadius?: string
    borderSize?: string
    paddingX?: string
    paddingY?: string
    height?: string
  }>
}

// --- Define input
export const ruleInput: DynamicRule<ThemeInput> = [
  /^input(?:-(.+))?$/,
  (match, context) => {
    const { theme } = context
    const [, b = 'DEFAULT'] = match
    const result: Record<string, string> = {}

    // --- Style.
    const variant = theme.inputVariant?.[b]
    if (variant) {
      Object.assign(result, {
        'font-size': variant.fontSize ? h.rem(variant.fontSize) : undefined,
        'border-radius': variant.borderRadius ? h.px(variant.borderRadius) : undefined,
        'border-width': variant.borderSize ? h.px(variant.borderSize) : undefined,
        'border-style': variant.borderStyle ?? 'solid',
        'padding-left': variant.paddingX ? h.px(variant.paddingX) : undefined,
        'padding-right': variant.paddingX ? h.px(variant.paddingX) : undefined,
        'padding-top': variant.paddingY ? h.px(variant.paddingY) : undefined,
        'padding-bottom': variant.paddingY ? h.px(variant.paddingY) : undefined,
        'height': variant.height ? h.px(variant.height) : undefined,
        'outline': 'none',
        'white-space': 'nowrap',
      })
    }

    // --- Color.
    const color = theme.inputColor?.[b]
    if (color) {
      Object.assign(result, {
        '--un-input-color': colorToString(color),
        'color': 'var(--un-input-color)',
        'border-color': 'var(--un-input-color)',
      })
    }

    // --- Background.
    const background = theme.inputBackground?.[b]
    if (background) {
      Object.assign(result, {
        '--un-input-background': colorToString(background),
        'background-color': 'var(--un-input-background)',
      })
    }

    // --- Border.
    const border = theme.inputBorder?.[b]
    if (border) {
      Object.assign(result, {
        '--un-input-border': colorToString(border),
        'border-color': 'var(--un-input-border)',
      })
    }

    if (b === 'soft') {
      Object.assign(result, {
        'border-width': '0',
        'background-color': 'rgba(var(--un-input-color), 0.1)',
      })
    }

    // --- If matched, return the result
    return Object.keys(result).length > 0 ? result : undefined
  },
  {
    layer: 'components',
    autocomplete: [
      'input',
      'input-$inputVariant',
      'input-$inputColor',
      'input-$inputBorder',
      'input-$inputBackground',
    ],
  },
]
