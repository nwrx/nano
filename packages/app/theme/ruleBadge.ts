import type { DynamicRule } from 'unocss'
import { parseCssColor } from '@unocss/rule-utils'

export interface ThemeBadge {
  badgeSize?: Record<string, {
    height: string
    spacing: string
    fontSize: string
    fontWeight?: string
    borderSize: string
    borderRadius: string
  }>
  badgeColor?: Record<string, {
    foreground: string
    background: string
    inverse?: string
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
    const size = theme.badgeSize?.[b]
    if (size) {
      const { spacing, height, fontSize, fontWeight, borderRadius, borderSize } = size
      Object.assign(result, {
        'display': 'inline-flex',
        'height': height,
        'line-height': height,
        'align-items': 'center',
        'padding-left': spacing,
        'padding-right': spacing,
        'font-weight': fontWeight,
        'font-size': fontSize,
        'white-space': 'nowrap',
        'border-radius': borderRadius,
        'border-width': borderSize,
        'border-style': 'solid',
        'color': 'rgb(var(--un-badge-foreground-color))',
        'border-color': 'transparent',
        'background-color': 'rgb(var(--un-badge-background-color) / var(--un-badge-opacity))',
      })
    }

    // --- Define badge color
    const color = theme.badgeColor?.[b]
    if (color) {
      const { foreground, background, inverse = background } = color
      Object.assign(result, {
        '--un-badge-opacity': 1,
        '--un-badge-foreground-color': parseCssColor(foreground)?.components.join(' '),
        '--un-badge-background-color': parseCssColor(background)?.components.join(' '),
        '--un-badge-inverse-color': parseCssColor(inverse)?.components.join(' '),
      })
    }

    // --- Define badge style
    if (b === 'outlined') {
      Object.assign(result, {
        'color': 'rgb(var(--un-badge-inverse-color))',
        'border-color': 'rgb(var(--un-badge-inverse-color))',
        'background-color': 'transparent',
      })
    }

    if (b === 'soft') {
      Object.assign(result, {
        '--un-badge-opacity': 0.2,
        'color': 'rgb(var(--un-badge-inverse-color))',
        'background-color': 'rgb(var(--un-badge-background-color) / var(--un-badge-opacity))',
      })
    }

    // --- If matched, return the result
    return result
  },
  {
    layer: 'components',
    autocomplete: [
      'badge',
      'badge-$badgeSize',
      'badge-$badgeColor',
      'badge-outlined',
      'badge-soft',
    ],
  },
]
