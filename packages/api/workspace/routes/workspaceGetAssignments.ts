import type { ModuleWorkspace } from '../index'
import type { WorkspaceUserPermissions } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getWorkspace, getWorkspaceAssignments } from '../utils'

export function workspaceGetAssignments(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/assignments',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<WorkspaceUserPermissions[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event, { optional: true })
      const workspace = await getWorkspace.call(this, { name: parameters.workspace, user, permission: 'Read' })
      return getWorkspaceAssignments.call(this, { workspace })
    },
  )
}
