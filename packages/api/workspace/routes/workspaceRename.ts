import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getWorkspace, renameWorkspace } from '../utils'

export function workspaceSetName(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/name',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createParser({
        name: [assertStringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { Workspace } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and ensure user has owner permissions
      const workspace = await getWorkspace.call(this, { name: parameters.workspace, user, permission: 'Owner' })

      // --- Rename the workspace and save to the database
      const updatedWorkspace = await renameWorkspace.call(this, { workspace, name: body.name })
      await Workspace.save(updatedWorkspace)
    },
  )
}
