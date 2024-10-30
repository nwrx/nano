import type { Node } from '@nwrx/core'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { flowFromJsonV1 } from '@nwrx/core'
import { Core } from '@nwrx/module-core'
import { Openai } from '@nwrx/module-openai'

/**
 * Resolves the flow instance from the flow, project, and workspace.
 *
 * @param flow The flow to resolve the instance for.
 * @returns The resolved flow instance.
 */
export async function resolveFlowInstance(this: ModuleFlow, flow: Flow) {
  const flowInstance = flowFromJsonV1(flow.data, {
    meta: {
      name: flow.title,
      description: flow.description,
    },
    resolveNode: (kind) => {
      const [provider, module, name] = kind.split(/[/:]/)
      let node: Node | undefined
      if (provider === 'nwrx' && module === 'core')
        node = Core.nodes?.find(n => n.kind === name)
      if (provider === 'nwrx' && module === 'openai')
        node = Openai.nodes?.find(n => n.kind === name)
      if (!node) throw new Error(`Node not found: ${kind}`)
      return { ...node, kind: `${provider}/${module}:${name}` }
    },
    resolveSecret: (name) => {
      if (!flow.project) throw new Error('The project of the flow is not loaded.')
      if (!flow.project.secrets) throw new Error('The secrets of the project are not loaded.')
      const secret = flow.project.secrets.find(s => s.name === name)
      if (!secret) throw new Error(`Secret not found: ${name}`)
      return secret.cipher
    },
    resolveVariable: (name) => {
      if (!flow.project) throw new Error('The project of the flow is not loaded.')
      if (!flow.project.variables) throw new Error('The variables of the project are not loaded.')
      const variable = flow.project.variables.find(v => v.name === name)
      if (!variable) throw new Error(`Variable not found: ${name}`)
      return variable.value
    },
  })

  // --- Resolve all the nodes in the flow.
  for (const node of flowInstance.nodes) await node.refresh()
  return flowInstance
}
