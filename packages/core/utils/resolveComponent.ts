import type { MaybePromise } from '@unshared/types'
import type { Component } from './defineComponent'
import type { SpecifierObject } from './parseSpecifier'
import { ERRORS as E } from './errors'
import { isComponent } from './isComponent'

/**
 * A function that is used to resolve a component. The resolve function
 * is used to resolve the component to a value that can be used in the
 * flow.
 */
export type ComponentResolver = (specifier: SpecifierObject) => MaybePromise<Component<any, any> | undefined>

/**
 * The function that is used to resolve a component. The resolve function
 * is used to resolve the component to a value that can be used in the
 * flow.
 *
 * @param specifier The specifier of the node to resolve.
 * @param resolvers The resolvers that are used to resolve the component.
 * @returns The resolved component.
 */
export async function resolveComponent(specifier: SpecifierObject, resolvers: ComponentResolver[]): Promise<Component> {
  const specifierObject = {
    collection: specifier.collection,
    name: specifier.name,
    registry: specifier.registry,
    tag: specifier.tag,
  }
  for (const resolve of resolvers) {
    const component = await resolve(specifierObject)
    if (component === undefined) continue
    if (!isComponent(component)) throw E.COMPONENT_RESOLVED_BUT_NOT_COMPONENT(specifierObject)
    return component
  }
  throw E.COMPONENT_NOT_RESOLVED(specifierObject)
}
