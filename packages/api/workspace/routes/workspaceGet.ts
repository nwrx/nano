import type { WorkspaceObject } from '../entities'
import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function workspaceGet(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<WorkspaceObject> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true })
      const { workspace } = parameters

      // --- Get the workspace and assert the user has access to it
      const found = await this.getWorkspace({ user, name: workspace, permission: 'Read' })
      return found.serialize()
    },
  )
}
