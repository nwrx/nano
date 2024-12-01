import type { DynamicRule } from 'unocss'
import type { CSSProperties } from 'vue'
import { colorToString } from '@unocss/rule-utils'
import { toCSSObject } from './utils'

export interface ThemeBadge {
  badgeColor?: Record<string, string>
  badgeBackground?: Record<string, string>
  badgeBorderColor?: Record<string, string>
  badgeVariant?: Record<string, CSSProperties>
}

// --- Define badge size
export const ruleBadge: DynamicRule<ThemeBadge> = [
  /^badge(?:-(.+))?$/,
  (match, context) => {
    const [, b = 'DEFAULT'] = match
    const { theme } = context
    const result: Record<string, string> = {}

    // --- Define badge size
    const variant = theme.badgeVariant?.[b]
    if (variant) {
      Object.assign(result, {
        'display': 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        'white-space': 'nowrap',
        'border-style': 'solid',
        ...toCSSObject(variant),
      })
    }

    const color = theme.badgeColor?.[b]
    if (color) {
      Object.assign(result, {
        '--un-badge-color': colorToString(color),
        'color': 'var(--un-badge-color)',
      })
    }

    const background = theme.badgeBackground?.[b]
    if (background) {
      Object.assign(result, {
        '--un-badge-background': colorToString(background),
        'background-color': 'var(--un-badge-background)',
      })
    }

    const border = theme.badgeBorderColor?.[b]
    if (border) {
      Object.assign(result, {
        '--un-badge-border-color': colorToString(border),
        'border-color': 'var(--un-badge-border-color)',
      })
    }

    // --- If matched, return the result
    return result
  },
  {
    layer: 'components',
    autocomplete: [
      'badge',
      'badge-$badgeColor',
      'badge-$badgeBackground',
      'badge-$badgeBorder',
      'badge-$badgeVariant',
    ],
  },
]
