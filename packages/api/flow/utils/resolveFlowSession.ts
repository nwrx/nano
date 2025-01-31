import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import type { FlowSession } from './createFlowSession'
import { flowFromJsonV1 } from '@nwrx/core'
import { default as Core } from '@nwrx/module-core'
import { createFlowSession } from './createFlowSession'

/**
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param flow The flow to resolve the session for.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export async function resolveFlowSession(this: ModuleFlow, flow: Flow): Promise<FlowSession> {

  // --- Check if the chain session is already in memory.
  // --- If so, return the chain session from memory.
  const exists = this.flowSessions.get(flow.id)
  if (exists) return exists

  // --- Assert the flow has a project and the project has secrets and variables.
  if (!flow.project) throw new Error('The project of the flow is not loaded.')
  if (!flow.project.secrets) throw new Error('The secrets of the project are not loaded.')
  if (!flow.project.variables) throw new Error('The variables of the project are not loaded.')

  // --- Create the flow instance.
  const flowInstance = await flowFromJsonV1(flow.data, [Core])
  flowInstance.meta.name = flow.title
  flowInstance.meta.description = flow.description
  for (const secret of flow.project.secrets) flowInstance.secrets[secret.name] = secret.cipher
  for (const variable of flow.project.variables) flowInstance.variables[variable.name] = variable.value

  // --- Create the flow session and store it in memory.
  const { Flow } = this.getRepositories()
  const session = createFlowSession(flowInstance, flow, Flow)
  this.flowSessions.set(flow.id, session)
  return session
}
