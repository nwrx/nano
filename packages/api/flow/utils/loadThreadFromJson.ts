import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { getModuleNode } from '@nwrx/nano'
import { defineComponent } from '@nwrx/nano'
import { createThreadFromFlow } from '@nwrx/nano'
import { memoize } from '@unshared/functions'
import { ModuleProject } from '../../project'
import { ModuleMonitoring } from '../../thread'

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
  const workspaceModule = this.getModule(ModuleProject)
  const monitoringModule = this.getModule(ModuleMonitoring)

  // --- Load the `Thread` instance based on the flow specification.
  const thread = createThreadFromFlow(flow.data, {
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
          const { ProjectVariable } = workspaceModule.getRepositories()
          const variable = await ProjectVariable.findOne({ where: { project, name } })
          if (!variable) throw new Error(`Variable not found: ${name}`)
          return variable.value
        }
        if ('$fromSecret' in reference) {
          const { name } = reference.$fromSecret
          const { project } = flow
          const { ProjectSecret } = workspaceModule.getRepositories()
          const secret = await ProjectSecret.findOne({ where: { project, name } })
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
