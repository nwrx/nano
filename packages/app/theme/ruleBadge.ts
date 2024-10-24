import type { DynamicRule } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { colorToString } from '@unocss/rule-utils'

export interface ThemeBadge {
  badgeColor?: Record<string, string>
  badgeBackground?: Record<string, string>
  badgeBorderColor?: Record<string, string>
  badgeVariant?: Record<string, {
    height: string
    spacing: string
    fontSize: string
    fontWeight?: string
    borderSize: string
    borderRadius: string
  }>
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
        'height': variant.height ? h.rem(variant.height) : undefined,
        'border-radius': variant.borderRadius ? h.px(variant.borderRadius) : undefined,
        'border-width': variant.borderSize ? h.px(variant.borderSize) : undefined,
        'border-style': 'solid',
        'align-items': 'center',
        'line-height': variant.height ? h.rem(variant.height) : undefined,
        'padding-left': variant.spacing ? h.rem(variant.spacing) : undefined,
        'padding-right': variant.spacing ? h.rem(variant.spacing) : undefined,
        'font-weight': variant.fontWeight,
        'font-size': variant.fontSize ? h.rem(variant.fontSize) : undefined,
        'white-space': 'nowrap',
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
