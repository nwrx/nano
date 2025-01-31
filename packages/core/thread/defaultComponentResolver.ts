import type { ComponentSpecifier } from '../utils'
import * as COMPONENTS from '../components'

export function DEFAULT_COMPONENT_RESOLVER(specifier: ComponentSpecifier) {
  if (specifier.moduleName !== 'core') return
  if (specifier.providerName !== undefined) return
  if (specifier.moduleVersion !== 'latest') return

  // --- Return the component if it exists in the components object.
  return specifier.componentName in COMPONENTS
    ? COMPONENTS[specifier.componentName as keyof typeof COMPONENTS]
    : undefined
}
