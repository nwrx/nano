import { createColorPalette } from '@unshared/color'

export const primary = createColorPalette('#b8b6ff', { stepUp: 3, stepDown: 20, hueShift: -60 })
export const secondary = createColorPalette('#635ae0', { stepUp: 8, stepDown: 5, hueShift: -20 })
export const accent = createColorPalette('#ede7b1', { stepUp: 3, stepDown: 13, hueShift: 50 })
export const danger = createColorPalette('#df3434', { stepUp: 9, stepDown: 8, hueShift: 20 })
export const warning = createColorPalette('#f0e68c', { stepUp: 3, stepDown: 5, hueShift: 20 })
export const success = createColorPalette('#2e8b57', { stepUp: 8, stepDown: 5, hueShift: 20 })
export const light = createColorPalette('#f8f9fa', { stepUp: 3, stepDown: 5, hueShift: 20 })
