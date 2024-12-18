import type { Component } from './defineComponent'
import type { SpecifierObject } from './parseSpecifier'
import * as COMPONENTS from '../components'

export function DEFAULT_COMPONENT_RESOLVER(specifier: SpecifierObject): Component | undefined {
  if (specifier.collection !== 'core') return
  if (specifier.registry !== 'default') return
  if (specifier.tag !== 'latest') return

  // --- Return the component if it exists in the components object.
  return specifier.name in COMPONENTS
    ? COMPONENTS[specifier.name as keyof typeof COMPONENTS]
    : undefined
}
