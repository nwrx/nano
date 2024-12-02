import type { Component } from '../module'
import type { ComponentResolver } from '../thread'

/**
 * The function that is used to resolve a node definition. The resolve function
 * is used to resolve the node definition to a value that can be used in the
 * flow.
 *
 * @param kind The kind of the node to resolve.
 * @param resolvers The resolvers that are used to resolve the node definition.
 * @returns The resolved node definition.
 */
export async function resolveComponent(kind: string, resolvers: ComponentResolver[]): Promise<Component> {
  for (const resolve of resolvers) {
    const definition = await resolve(kind)
    if (definition) return definition
  }
  throw new Error(`The component with kind "${kind}" could not be resolved.`)
}
