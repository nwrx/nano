import type { Flow } from '../../flow'
import type { ModuleFlow } from '../index'
import { createThreadFromFlow } from '@nwrx/nano'
import { ModuleProject } from '../../project'
// import { ModuleMonitoring } from '../../thread'

/**
 * Resolves the flow instance from the flow, project, and workspace.
 *
 * @param flow The flow to resolve the instance for.
 * @returns The resolved flow instance.
 */
export function loadThreadFromJson(this: ModuleFlow, flow: Flow) {
  const projectModule = this.getModule(ModuleProject)
  const { ProjectVariable, ProjectSecret } = projectModule.getRepositories()
  // const monitoringModule = this.getModule(ModuleMonitoring)

  // --- Load the `Thread` instance based on the flow specification.
  const thread = createThreadFromFlow(flow.data, {
    componentResolvers: [
      // memoize(async(kind) => {
      //   if (kind.startsWith('nwrx/')) kind = kind.slice(5)
      //   for (const module of MODULES) {
      //     const node = await getModuleNode(module, kind)
      //     if (node) return node
      //   }
      //   return FALLBACK_NODE(kind)
      // }),
    ],
    referenceResolvers: [
      async(type, ...values) => {
        if (type === 'Variables') {
          const [name] = values
          const { project } = flow
          const variable = await ProjectVariable.findOne({ where: { project, name } })
          if (!variable) throw new Error(`Variable not found: ${name}`)
          return variable.value
        }
        if (type === 'Secrets') {
          const [name] = values
          const { project } = flow
          const secret = await ProjectSecret.findOne({ where: { project, name } })
          if (!secret) throw new Error(`Secret not found: ${name}`)
          return secret.cipher
        }
      },
    ],
  })

  // --- Start monitoring the thread events.
  // monitoringModule.captureThreadEvents(thread, flow)
  return thread
}
