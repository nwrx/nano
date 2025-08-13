import type { ModuleMcpServer } from '..'
import type { McpServerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer } from '../utils'

export function mcpServerGet(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/pools/:pool/servers/:server',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withSpec: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withPool: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withTools: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withArguments: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withVariables: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpServerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const modulePool = this.getModule(ModuleMcpPool)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read' })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server, ...query })
      return server.serialize({ ...query })
    },
  )
}
