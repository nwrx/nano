/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Component } from './defineComponent'
import type { Module } from './defineModule'

/**
 * Given a `Module` object, list all the nodes matching the given search string.
 *
 * @param module The module object to resolve the nodes from.
 * @param search The search string to match the node kind against.
 * @returns The list of resolved node definitions.
 * @example
 *
 * // Search using the `Giphy` query.
 * const nodes = await getModuleNodes(module, 'Giphy') // [Component, ...]
 */

export async function getModuleNodes(module: Module, search: string): Promise<Component[]> {
  if (!module.nodes) return []

  // --- Resolve if async function.
  const nodes = typeof module.nodes === 'function' ? await module.nodes() : module.nodes

  // --- Find the node in the module.
  const searchLower = search.toLowerCase()
  return Object.values(nodes).filter(n => n.kind.includes(searchLower)
    || n.name?.toLowerCase().includes(searchLower)
    || n.description?.toLowerCase().includes(searchLower),
  )
}
