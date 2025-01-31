import type { UUID } from 'node:crypto'
import type { ModuleFlow } from '..'
import type { FlowSession } from './createFlowSession'
import { createFlow } from '@nanoworks/core'
import Core from '@nanoworks/module-core'
import { createFlowSession } from './createFlowSession'

/**
 * Given an ID, create or get the `ChainSession` that corresponds to the ID and
 * return it.
 *
 * @param id The ID to get the `ChainSession` for.
 * @returns The `ChainSession` that corresponds to the ID.
 */
export async function resolveFlowSession(this: ModuleFlow, id: UUID): Promise<FlowSession> {

  // --- Check if the chain session is already in memory.
  const session = this.flowSessions.get(id)
  if (session) return session

  // --- Create a new chain session.
  const { Flow } = this.entities
  const flowEntity = await Flow.findOneBy({ id })
  if (!flowEntity) throw this.errors.FLOW_NOT_FOUND(id)

  const flow = createFlow([Core])
  flow.name = flowEntity.name
  flow.description = flowEntity.description

  for (const node of flow.nodes) {
    await node.resolveDataSchema()
    await node.resolveResultSchema()
  }

  const newSession = createFlowSession(flow, flowEntity)
  this.flowSessions.set(id, newSession)
  return newSession
}
