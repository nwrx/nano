import type { Component } from './defineComponent'
import type { SpecifierObject } from './parseSpecifier'
import { COMPONENTS } from '../components'

export function DEFAULT_COMPONENT_RESOLVER(specifier: SpecifierObject): Component | undefined {
  if (specifier.registry !== 'default') return
  if (specifier.workspace !== 'default') return
  if (specifier.collection !== 'default') return
  if (specifier.tag !== 'latest') return

  // --- Return the component if it exists in the components object.
  return COMPONENTS.find(x => x.name === specifier.name)
}
