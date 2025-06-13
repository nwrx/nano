import type { RegistryComponentObject } from '@nwrx/nano-api'

export function getComponentColor(component?: RegistryComponentObject) {
  if (!component) return '#fff'
  const purposeCategory = component.categories?.find(category => category.type === 'Purpose')
  if (!purposeCategory) return '#fff'
  if (purposeCategory.name === 'control') return '#FF0000'
  if (purposeCategory.name === 'models') return '#00FF00'
  if (purposeCategory.name === 'processing') return '#0000FF'
  if (purposeCategory.name === 'storage') return '#0000FF'
  if (purposeCategory.name === 'mcp') return '#FF00FF'
  return '#000'
}
