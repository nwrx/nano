import type { Flow as FlowEntity } from '../entities'
import type { ModuleFlow } from '../index'
import { Flow } from '@nwrx/core'
import { Core } from '@nwrx/module-core'
import { ModuleWorkspace } from '../../workspace'

const MODULES = [
  Core,
]

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
        const [module] = kind.split('/')

        // --- Find the module in the list.
        const moduleInstance = MODULES.find(m => m.kind === module)
        if (!moduleInstance) throw new Error(`Module not found: ${module}`)
        if (!moduleInstance.nodes) throw new Error(`Nodes not found: ${module}`)

        // --- Find the node in the module.
        const node = Object.values(moduleInstance.nodes).find(n => n.kind === kind)
        if (!node) throw new Error(`Node not found: ${kind}`)
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
