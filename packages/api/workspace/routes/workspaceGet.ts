import type { WorkspaceObject } from '../entities'
import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getWorkspace } from '../utils'

export function workspaceGet(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withArchivedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<WorkspaceObject> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true })
      const workspace = await getWorkspace.call(this, { user, name: parameters.workspace, permission: 'Read', ...query })
      return workspace.serialize(query)
    },
  )
}
