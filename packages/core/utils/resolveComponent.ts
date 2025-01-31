import type { MaybePromise } from '@unshared/types'
import type { Component } from './defineComponent'
import type { ComponentSpecifier } from './parseSpecifier'
import { isComponent } from './isComponent'
import { parseSpecifier } from './parseSpecifier'

/**
 * A function that is used to resolve a component. The resolve function
 * is used to resolve the component to a value that can be used in the
 * flow.
 */
export type ComponentResolver = (specifier: ComponentSpecifier) => MaybePromise<Component<any, any> | undefined>

/**
 * The function that is used to resolve a component. The resolve function
 * is used to resolve the component to a value that can be used in the
 * flow.
 *
 * @param specifier The specifier of the node to resolve.
 * @param resolvers The resolvers that are used to resolve the component.
 * @returns The resolved component.
 */
export async function resolveComponent(specifier: string, resolvers: ComponentResolver[]): Promise<Component> {
  const specifierObject = parseSpecifier(specifier)
  for (const resolve of resolvers) {
    const component = await resolve(specifierObject)
    if (component === undefined) continue
    if (!isComponent(component)) throw new Error(`The component with specifier "${specifier}" could was resolved but is not a valid component.`)
    return component
  }
  throw new Error(`The component with specifier "${specifier}" could not be resolved.`)
}
