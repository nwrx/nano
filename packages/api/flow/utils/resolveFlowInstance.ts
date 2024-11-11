import type { Flow as FlowEntity } from '../entities'
import type { ModuleFlow } from '../index'
import { Flow } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { Core } from '@nwrx/module-core'
import { ModuleWorkspace } from '../../workspace'

const MODULES = [
  Core,
]

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
      (kind) => {
        if (kind.startsWith('nwrx/')) kind = kind.slice(5)
        const [module] = kind.split('/')

        // --- Find the module in the list.
        const moduleInstance = MODULES.find(m => m.kind === module)
        if (!moduleInstance) return FALLBACK_NODE(kind)
        if (!moduleInstance.nodes) return FALLBACK_NODE(kind)

        // --- Find the node in the module.
        const node = Object.values(moduleInstance.nodes).find(n => n.kind === kind)
        if (!node) return FALLBACK_NODE(kind)
        return node
      },
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
      },
    ],
  })
}
