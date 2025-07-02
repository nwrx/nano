import type { ModuleMcpManager } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager } from '../utils'

export function mcpManagerRemove(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'DELETE /api/mcp/:_identity',
      parseParameters: createParser({
        _identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { _identity: identity } = parameters

      // --- Get the MCP manager by identity and soft remove it.
      const manager = await getManager.call(this, { user, identity })
      manager.deletedAt = new Date()
      manager.deletedBy = user

      // --- Save the updated record.
      const { McpManager } = this.getRepositories()
      await McpManager.save(manager)
    },
  )
}
