import { createColorPalette } from '@unshared/color/createColorPalette'

export const COLORS = {
  primary: createColorPalette('#4636D9', { stepUp: 10, stepDown: 12, hueShift: -15 }),
  secondary: createColorPalette('#3B82F6', { stepUp: 8, stepDown: 13, hueShift: -10 }),
  accent: createColorPalette('#F59E0B', { stepUp: 9, stepDown: 10, hueShift: 50 }),
  danger: createColorPalette('#df3434', { stepUp: 9, stepDown: 8, hueShift: 20 }),
  warning: createColorPalette('#f59e0b', { stepUp: 10, stepDown: 5, hueShift: 20 }),
  success: createColorPalette('#5e8b57', { stepUp: 11, stepDown: 5, hueShift: 20 }),
  light: createColorPalette('#f3f4f6', { stepUp: 8, stepDown: 5, hueShift: 20 }),
}
