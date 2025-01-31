import { createColorPalette } from '@unshared/color/createColorPalette'

export const CONSTANTS = {
  appTitle: 'Nanoworks',
  appDescription: 'A flow-based programming environment.',
  appHost: 'app.nwrx.io',
  appCanonicalUrl: 'https://app.nwrx.io',
}

const stops = [50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900, 910, 920, 930, 940, 950] as const
type STOPS = Array<typeof stops[number]>

export const COLORS = {
  primary: createColorPalette('#5636D9', { stepUp: 10, stepDown: 11, hueShift: 0, stops: stops as unknown as STOPS }),
  secondary: createColorPalette('#F59E0B', { stepUp: 9, stepDown: 10, hueShift: 50, stops: stops as unknown as STOPS }),
  danger: createColorPalette('#D53B23', { stepUp: 9, stepDown: 8, hueShift: 20 }),
  warning: createColorPalette('#ADEF1F', { stepUp: 10, stepDown: 5, hueShift: 20 }),
  success: createColorPalette('#5DB65A', { stepUp: 11, stepDown: 10, hueShift: 10 }),
}
