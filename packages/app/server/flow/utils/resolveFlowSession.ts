import type { UUID } from 'node:crypto'
import type { ModuleFlow } from '..'
import { Flow } from '@nanoworks/core'
import Core from '@nanoworks/module-core'
import { createFlowSession } from './createFlowSession'

/**
 * Given an ID, create or get the `ChainSession` that corresponds to the ID and
 * return it.
 *
 * @param id The ID to get the `ChainSession` for.
 * @returns The `ChainSession` that corresponds to the ID.
 */
export async function resolveFlowSession(this: ModuleFlow, id: UUID) {

  // --- Check if the chain session is already in memory.
  const session = this.flowSessions.get(id)
  if (session) return session

  // --- Create a new chain session.
  const flow = new Flow([Core])

  for (const node of flow.nodes) {
    await node.resolveDataSchema()
    await node.resolveResultSchema()
  }

  const newSession = createFlowSession(flow)
  this.flowSessions.set(id, newSession)
  return newSession
}
