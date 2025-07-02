/* eslint-disable unicorn/no-null */
import type { ModuleMcpManager } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager } from '../utils'

export function mcpManagerEnable(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'POST /api/mcp/:identity/enable',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Get the MCP manager by identity
      const manager = await getManager.call(this, { user, identity })
      if (!manager.disabledAt) throw this.errors.MCP_MANAGER_ALREADY_ENABLED(identity)
      manager.disabledAt = null
      manager.updatedBy = user

      // --- Save the updated record.
      const { McpManager } = this.getRepositories()
      await McpManager.save(manager)
    },
  )
}
