import type { UUID } from 'node:crypto'
import type { ModuleFlow } from '..'
import type { FlowSession } from './createFlowSession'
import { flowFromJsonV1 } from '@nwrx/core'
import Core from '@nwrx/module-core'
import { createFlowSession } from './createFlowSession'

/**
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param id The ID to get the `FlowSession` for.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export async function resolveFlowSession(this: ModuleFlow, id: UUID): Promise<FlowSession> {

  // --- Check if the chain session is already in memory.
  // --- If so, return the chain session from memory.
  const session = this.flowSessions.get(id)
  if (session) return session

  // --- Create a new chain session.
  const { Flow } = this.entities
  const flowEntity = await Flow.findOneBy({ id })
  if (!flowEntity) throw this.errors.FLOW_NOT_FOUND(id)

  // --- Create the flow instance and the chain session.
  const flow = await flowFromJsonV1(flowEntity.data, [Core])
  flow.modules = [Core]
  const newSession = createFlowSession(flow, flowEntity)
  this.flowSessions.set(id, newSession)
  return newSession
}
