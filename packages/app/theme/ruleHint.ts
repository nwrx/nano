import type { DynamicRule } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { colorToString } from '@unocss/rule-utils'

export interface ThemeHint {
  hintColor?: Record<string, string>
  hintBackground?: Record<string, string>
  hintOpacity?: Record<string, string>
  hintSize?: Record<string, {
    fontSize: string
    borderRadius: string
    borderSize: string
    padding: string
  }>
}

// --- Define hint
export const ruleHint: DynamicRule<ThemeHint> = [
  /^hint(?:-(.+))?$/,
  (match, context) => {
    const { theme } = context
    const [, b = 'DEFAULT'] = match
    const result: Record<string, string> = {}

    // --- Style.
    const size = theme.hintSize?.[b]
    if (size) {
      const { fontSize, borderRadius, borderSize, padding } = size
      Object.assign(result, {
        'font-size': h.rem(fontSize),
        'border-radius': h.px(borderRadius),
        'border-width': h.px(borderSize),
        'border-style': 'solid',
        'padding': h.rem(padding),
      })
    }

    // --- Color.
    const color = theme.hintColor?.[b]
    if (color) {
      Object.assign(result, {
        '--un-hint-color': colorToString(color),
        'color': 'var(--un-hint-color)',
        'border-color': 'var(--un-hint-color)',
      })
    }

    // --- Background.
    const background = theme.hintBackground?.[b]
    if (background) {
      Object.assign(result, {
        '--un-hint-background': colorToString(background),
        'background-color': 'var(--un-hint-background)',
      })
    }

    // --- If matched, return the result
    return Object.keys(result).length > 0 ? result : undefined
  },
  {
    layer: 'components',
    autocomplete: [
      'hint',
      'hint-$hintSize',
      'hint-$hintColor',
      'hint-$hintBackground',
      'hint-$hintOpacity',
    ],
  },
]
