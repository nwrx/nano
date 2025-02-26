import type { Component } from './defineComponent'
import type { SpecifierObject } from './parseSpecifier'
import { components } from '../components/components'

export function DEFAULT_COMPONENT_RESOLVER(specifier: SpecifierObject): Component | undefined {
  if (specifier.workspace !== 'default') return
  if (specifier.collection !== 'default') return
  if (specifier.registry !== 'default') return
  if (specifier.tag !== 'latest') return

  // --- Return the component if it exists in the components object.
  return specifier.name in components
    ? components[specifier.name as keyof typeof components]
    : undefined
}
