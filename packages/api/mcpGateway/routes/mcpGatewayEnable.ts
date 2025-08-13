/* eslint-disable unicorn/no-null */
import type { ModuleMcpGateway } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway } from '../utils'

export function mcpGatewayEnable(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'POST /mcp/:manager/gateways/:identity/enable',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the gateway by manager and identity and disable it if enabled.
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      if (!gateway.disabledAt) throw this.errors.MCP_GATEWAY_ALREADY_ENABLED(parameters.manager, parameters.identity)
      gateway.disabledAt = null
      gateway.updatedBy = user

      // --- Save and return the updated record.
      const { McpGateway } = this.getRepositories()
      await McpGateway.save(gateway)
    },
  )
}
