import type { Flow as FlowEntity } from '../entities'
import type { ModuleFlow } from '../index'
import { Flow, getModuleNode } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { memoize } from '@unshared/functions'
import { ModuleWorkspace } from '../../workspace'
import { MODULES } from './constants'

function FALLBACK_NODE(kind: string) {
  return defineNode({
    kind,
    name: kind,
    description: 'The node is not available.',
  })
}

/**
 * Resolves the flow instance from the flow, project, and workspace.
 *
 * @param entity The flow to resolve the instance for.
 * @returns The resolved flow instance.
 */
export function resolveFlowInstance(this: ModuleFlow, entity: FlowEntity) {
  const workspaceModule = this.getModule(ModuleWorkspace)
  return Flow.fromJSON(entity.data, {
    resolveNode: [
      memoize(async(kind) => {
        if (kind.startsWith('nwrx/')) kind = kind.slice(5)

        // --- Find the node in the module.
        for (const module of MODULES) {
          const node = await getModuleNode(module, kind)
          if (node) return node
        }

        return FALLBACK_NODE(kind)
      }),
    ],
    resolveReference: [
      async(reference) => {
        if ('$fromVariable' in reference) {
          const { name } = reference.$fromVariable
          const { project } = entity
          const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
          const variable = await WorkspaceProjectVariable.findOne({ where: { project, name } })
          if (!variable) throw new Error(`Variable not found: ${name}`)
          return variable.value
        }
        if ('$fromSecret' in reference) {
          const { name } = reference.$fromSecret
          const { project } = entity
          const { WorkspaceProjectSecret } = workspaceModule.getRepositories()
          const secret = await WorkspaceProjectSecret.findOne({ where: { project, name } })
          if (!secret) throw new Error(`Secret not found: ${name}`)
          return secret.cipher
        }
      },
    ],
  })
}
