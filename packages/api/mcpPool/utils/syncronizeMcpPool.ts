/* eslint-disable unicorn/prefer-ternary */
import type { Loose } from '@unshared/types'
import type { ModuleMcpPool } from '../index'
import { createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpPool } from './assertMcpPool'
import { DEFAULT_MCP_POOL_SPEC } from './constants'
import { getMcpPoolManager } from './getMcpPoolManager'

const SYNCRONIZE_MCP_POOL_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
})

/** The options for synchronizing an MCP pool. */
export type SyncronizeMcpPoolOptions = Loose<ReturnType<typeof SYNCRONIZE_MCP_POOL_OPTIONS_SCHEMA>>

/**
 * Synchronize an MCP pool with the MCP manager. This function will call the
 * MCP manager client to synchronize the pool in the underlying Kubernetes cluster
 * and create the MCPPool resource if it does not exist.
 *
 * @param option The options for synchronizing the MCP pool.
 * @returns The MCP pool entity after synchronization.
 */
export async function syncronizeMcpPool(this: ModuleMcpPool, option: SyncronizeMcpPoolOptions): Promise<void> {
  const moduleManager = this.getModule(ModuleMcpManager)
  const { workspace, pool } = SYNCRONIZE_MCP_POOL_OPTIONS_SCHEMA(option)

  // --- Get the MCP pool manager client.
  const manager = await getMcpPoolManager.call(this, { workspace, pool })
  const client = moduleManager.getManagerClient(manager)

  // --- First, check if the pool exists.
  const exists = await client.poolExists(pool.id)
  if (exists) await client.updatePool(pool.id, { ...DEFAULT_MCP_POOL_SPEC, ...pool.spec })
  else await client.createPool({ name: pool.id, ...DEFAULT_MCP_POOL_SPEC, ...pool.spec })

}
