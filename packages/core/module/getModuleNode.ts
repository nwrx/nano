import type { Module } from './defineModule'
import type { FlowNodeDefinition } from './defineNode'
import { isFlowNodeDefinition } from './isFlowNodeDefinition'

/**
 * Given a `Module` object, this function resolves the node definition
 * for the given `kind` string. The `kind` string is the unique identifier
 * for the node definition.
 *
 * @param module The module object to resolve the node from.
 * @param kind The kind string of the node definition.
 * @returns The resolved node definition or `undefined` if not found.
 */
export async function getModuleNode(module: Module, kind: string): Promise<FlowNodeDefinition | undefined> {
  if (!module.nodes) return undefined

  // --- Resolve if async function.
  const nodes = typeof module.nodes === 'function'
    ? await module.nodes()
    : module.nodes

  // --- Find the node in the module and return it.
  const node = Object.values(nodes).find(n => n.kind === kind)
  return isFlowNodeDefinition(node) ? node : undefined
}
