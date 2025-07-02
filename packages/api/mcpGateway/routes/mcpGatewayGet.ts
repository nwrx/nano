import type { ModuleMcpGateway } from '..'
import type { McpGatewayObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway } from '../utils'

export function mcpGatewayGet(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'GET /api/mcp/:_manager/gateways/:identity',
      parseParameters: createParser({
        _manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withManager: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpGatewayObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the gateway by manager and identity.
      const manager = await moduleManager.getManager({ user, identity: parameters._manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity, ...query })

      // --- Return the serialized gateway object.
      return gateway.serialize(query)
    },
  )
}
