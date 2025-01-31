import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import type { FlowSession } from './createFlowSession'
import { flowFromJsonV1 } from '@nwrx/core'
import Core from '@nwrx/module-core'
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

  // --- Create the flow instance and the chain session.
  const flowInstance = await flowFromJsonV1(flow.data, [Core])
  flowInstance.modules = [Core]
  const session = createFlowSession(flowInstance, flow)
  this.flowSessions.set(flow.id, session)
  return session
}
