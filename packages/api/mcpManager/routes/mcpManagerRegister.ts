import type { ModuleMcpManager } from '..'
import type { McpManagerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { registerManager } from '../utils'

export function mcpManagerRegister(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'POST /mcp',
      parseBody: createParser({
        address: assert.stringNotEmpty,
        identity: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, body }): Promise<McpManagerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { address, identity } = body

      // --- Register the MCP manager with the provided address and identity.
      const manager = await registerManager.call(this, { user, address, identity })
      return manager.serialize()
    },
  )
}
