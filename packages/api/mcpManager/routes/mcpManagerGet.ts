import type { ModuleMcpManager } from '..'
import type { McpManagerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager } from '../utils'

export function mcpManagerGet(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      // We have to prefix the named parameter with an underscore to avoid
      // conflicts with other routes. This is a bug of the `h3` router.
      name: 'GET /mcp/:_identity',
      parseParameters: createParser({
        _identity: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withGateways: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpManagerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the MCP manager by identity and return the serialized object.
      const manager = await getManager.call(this, { user, identity: parameters._identity, ...query })
      return manager.serialize(query)
    },
  )
}
