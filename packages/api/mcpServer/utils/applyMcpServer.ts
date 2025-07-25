/* eslint-disable unicorn/prefer-ternary */
import type { Loose } from '@unshared/types'
import type { ModuleMcpServer } from '..'
import { createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleMcpPool } from '../../mcpPool'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpServer } from './assertMcpServer'

const APPLY_MCP_SERVER_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
  server: assertMcpServer,
})

/** The options for synchronizing an MCP server. */
export type ApplyMcpServerOptions = Loose<ReturnType<typeof APPLY_MCP_SERVER_OPTIONS_SCHEMA>>

/**
 * Synchronize an MCP server with the MCP manager.
 * This function will call the MCP manager client to synchronize the server.
 *
 * @param option The options for synchronizing the MCP server.
 * @returns The MCP server entity after synchronization.
 */
export async function applyMcpServer(this: ModuleMcpServer, option: ApplyMcpServerOptions) {
  const modulePool = this.getModule(ModuleMcpPool)
  const moduleManager = this.getModule(ModuleMcpManager)
  const { workspace, pool, server } = APPLY_MCP_SERVER_OPTIONS_SCHEMA(option)

  // --- Get the MCP pool manager client.
  const manager = await modulePool.getPoolManager({ workspace, pool })
  const client = moduleManager.getManagerClient(manager)

  // --- If the `command` is empty, it should be `undefined`.
  let command = server.spec.command
  if (command !== undefined && command.join('').trim() === '')
    command = undefined

  // --- Get the MCP server manager client.
  const exists = await client.serverExists(server.id)
  if (exists) {
    await client.updateServer(server.id, {
      pool: pool.id,
      image: server.spec.image,
      command,
      // transport: server.spec.transport,
      idleTimeout: server.spec.idleTimeout,
    })
  }
  else {
    await client.createServer({
      name: server.id,
      pool: pool.id,
      image: server.spec.image,
      command,
      // transport: server.spec.transport,
      idleTimeout: server.spec.idleTimeout,
    })
  }
}
