import type { ModuleMcpManager } from '..'
import type { McpManagerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchManager } from '../utils'

export function mcpManagerSearch(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'GET /mcp',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withGateways: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<McpManagerObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the MCP managers based on the search query and return serialized objects.
      const managers = await searchManager.call(this, { user, ...query })
      return managers.map(manager => manager.serialize(query))
    },
  )
}
