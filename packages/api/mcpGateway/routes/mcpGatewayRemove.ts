import type { ModuleMcpGateway } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway } from '../utils'

export function mcpGatewayRemove(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'DELETE /api/mcp/:manager/gateways/:identity',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the MCP gateway by manager and identity.
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      gateway.deletedAt = new Date()
      gateway.deletedBy = user

      // --- Save the updated record.
      const { McpGateway } = this.getRepositories()
      await McpGateway.save(gateway)
    },
  )
}
