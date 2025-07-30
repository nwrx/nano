import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getWorkspace, renameWorkspace } from '../utils'

export function workspaceSetName(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: [assert.stringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await getWorkspace.call(this, { name: parameters.workspace, user, permission: 'Owner' })
      await renameWorkspace.call(this, { workspace, user, name: body.name })
    },
  )
}
