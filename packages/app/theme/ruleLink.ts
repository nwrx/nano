import type { DynamicRule } from 'unocss'
import type { CSSProperties } from 'vue'
import { colorToString } from '@unocss/rule-utils'
import { toCSSObject } from './utils'

export interface ThemeHyperlink {
  hyperlinkColor?: Record<string, string>
  hyperlinkVariant?: Record<string, CSSProperties>
}

export const ruleLink: DynamicRule<ThemeHyperlink> = [
  /^hyperlink(?:-(.+))?$/,
  (match, context) => {
    const { theme } = context
    const [, l = 'DEFAULT'] = match
    const result: Record<string, string> = {}

    // --- Variant.
    const variant = theme.hyperlinkVariant?.[l]
    if (variant) {
      Object.assign(result, {
        'display': 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        'text-decoration': 'underline',
        'cursor': 'pointer',
        ...toCSSObject(variant),
      })
    }

    // --- Color.
    const color = theme.hyperlinkColor?.[l]
    if (color) {
      Object.assign(result, {
        '--un-link-color': colorToString(color),
        'color': 'var(--un-link-color)',
      })
    }

    // --- If matched, return the result
    return Object.keys(result).length > 0 ? result : undefined
  },
  {
    layer: 'components',
    autocomplete: [
      'link',
      'link-$linkColor',
      'link-$linkVariant',
    ],
  },
]
