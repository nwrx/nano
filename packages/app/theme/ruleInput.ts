import type { DynamicRule } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { colorToString } from '@unocss/rule-utils'

export interface ThemeInput {
  inputColor?: Record<string, string>
  inputBorder?: Record<string, string>
  inputBackground?: Record<string, string>
  inputVariant?: Record<string, {
    fontSize?: string
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
    const size = theme.inputVariant?.[b]
    if (size) {
      const { fontSize, borderRadius, borderSize, paddingX, paddingY } = size
      Object.assign(result, {
        'font-size': fontSize ? h.rem(fontSize) : undefined,
        'border-radius': borderRadius ? h.px(borderRadius) : undefined,
        'border-width': borderSize ? h.px(borderSize) : undefined,
        'border-style': 'solid',
        'padding-left': paddingX ? h.px(paddingX) : undefined,
        'padding-right': paddingX ? h.px(paddingX) : undefined,
        'padding-top': paddingY ? h.px(paddingY) : undefined,
        'padding-bottom': paddingY ? h.px(paddingY) : undefined,
        'height': size.height ? h.px(size.height) : undefined,
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
