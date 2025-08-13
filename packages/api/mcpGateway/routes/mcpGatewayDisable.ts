import type { ModuleMcpGateway } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway } from '../utils'

export function mcpGatewayDisable(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'POST /mcp/:manager/gateways/:identity/disable',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the MCP gateway by manager and identity and enable it if disabled.
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      if (gateway.disabledAt) throw this.errors.MCP_GATEWAY_ALREADY_DISABLED(parameters.manager, parameters.identity)
      gateway.disabledAt = new Date()
      gateway.disabledBy = user

      // --- Save and return the updated record.
      const { McpGateway } = this.getRepositories()
      await McpGateway.save(gateway)
    },
  )
}
