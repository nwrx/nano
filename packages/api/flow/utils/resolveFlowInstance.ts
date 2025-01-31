import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { flowFromJsonV1 } from '@nwrx/core'
import { Core } from '@nwrx/module-core'

declare module '@nwrx/core' {
  export interface FlowMeta {
    secrets: string[]
    variables: string[]
  }
}

const MODULES = [
  Core,
]

/**
 * Resolves the flow instance from the flow, project, and workspace.
 *
 * @param entity The flow to resolve the instance for.
 * @returns The resolved flow instance.
 */
export async function resolveFlowInstance(this: ModuleFlow, entity: Flow) {
  const flowInstance = await flowFromJsonV1(entity.data, {
    meta: {
      name: entity.title,
      description: entity.description,
      secrets: entity.project?.secrets?.map(s => s.name) ?? [],
      variables: entity.project?.variables?.map(v => v.name) ?? [],
    },
    resolveNode: (kind) => {
      const [module] = kind.split('/')

      const moduleInstance = MODULES.find(m => m.kind === module)
      if (!moduleInstance) throw new Error(`Module not found: ${module}`)
      if (!moduleInstance.nodes) throw new Error(`Nodes not found: ${module}`)

      // --- Find the node in the module.
      const node = Object.values(moduleInstance.nodes).find(n => n.kind === kind)
      if (!node) throw new Error(`Node not found: ${kind}`)
      return node
    },
    resolveReference: (flow, type, reference) => {
      if (!entity.project) throw new Error('The project of the flow is not loaded.')

      if (type === 'SECRET') {
        if (!entity.project.secrets) throw new Error('The secrets of the project are not loaded.')
        const secret = entity.project.secrets.find(s => s.name === reference)
        if (!secret) throw new Error(`Secret not found: ${reference}`)
        return 'secret.cipher'
      }

      // --- Value from variable.
      if (type === 'VARIABLE') {
        if (!entity.project.variables) throw new Error('The variables of the project are not loaded.')
        const variable = entity.project.variables.find(v => v.name === reference)
        if (!variable) throw new Error(`Variable not found: ${reference}`)
        return variable.value
      }
    },
  })

  // --- Resolve all the nodes in the flow.
  for (const node of flowInstance.nodes) await node.resolveData()
  return flowInstance
}
