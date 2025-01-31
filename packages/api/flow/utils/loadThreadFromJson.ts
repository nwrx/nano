import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { getModuleNode } from '@nwrx/core'
import { defineComponent } from '@nwrx/core'
import { createThreadFromJson } from '@nwrx/core'
import { memoize } from '@unshared/functions'
import { ModuleMonitoring } from '../../monitoring'
import { ModuleWorkspace } from '../../workspace'
import { MODULES } from './constants'

function FALLBACK_NODE(kind: string) {
  return defineComponent({
    kind,
    name: kind,
    description: 'The node is not available.',
  })
}

/**
 * Resolves the flow instance from the flow, project, and workspace.
 *
 * @param flow The flow to resolve the instance for.
 * @returns The resolved flow instance.
 */
export function loadThreadFromJson(this: ModuleFlow, flow: Flow) {
  const workspaceModule = this.getModule(ModuleWorkspace)
  const monitoringModule = this.getModule(ModuleMonitoring)

  // --- Load the `Thread` instance based on the flow specification.
  const thread = createThreadFromJson(flow.data, {
    componentResolvers: [
      memoize(async(kind) => {
        if (kind.startsWith('nwrx/')) kind = kind.slice(5)
        for (const module of MODULES) {
          const node = await getModuleNode(module, kind)
          if (node) return node
        }
        return FALLBACK_NODE(kind)
      }),
    ],
    referenceResolvers: [
      async(reference) => {
        if ('$fromVariable' in reference) {
          const { name } = reference.$fromVariable
          const { project } = flow
          const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
          const variable = await WorkspaceProjectVariable.findOne({ where: { project, name } })
          if (!variable) throw new Error(`Variable not found: ${name}`)
          return variable.value
        }
        if ('$fromSecret' in reference) {
          const { name } = reference.$fromSecret
          const { project } = flow
          const { WorkspaceProjectSecret } = workspaceModule.getRepositories()
          const secret = await WorkspaceProjectSecret.findOne({ where: { project, name } })
          if (!secret) throw new Error(`Secret not found: ${name}`)
          return secret.cipher
        }
      },
    ],
  })

  // --- Start monitoring the thread events.
  monitoringModule.captureThreadEvents(thread, flow)
  return thread
}
