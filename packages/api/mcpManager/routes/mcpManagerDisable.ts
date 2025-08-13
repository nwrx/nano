import type { ModuleMcpManager } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager } from '../utils'

export function mcpManagerDisable(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'POST /mcp/:identity/disable',
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
      if (manager.disabledAt) throw this.errors.MCP_MANAGER_ALREADY_DISABLED(identity)
      manager.disabledAt = new Date()
      manager.updatedBy = user

      // --- Save the updated record.
      const { McpManager } = this.getRepositories()
      await McpManager.save(manager)
    },
  )
}
