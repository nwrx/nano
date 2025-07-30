import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject, removeProject } from '../utils'

export function projectRemove(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/projects/:project',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, user, workspace, permission: 'Owner' })
      await removeProject.call(this, { workspace, project, user })
    },
  )
}
