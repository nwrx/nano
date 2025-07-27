import type { ProjectObject } from '../entities'
import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createProject } from '../utils'

export function projectCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/projects',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<ProjectObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name } = body

      // --- Create the project in the workspace.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Write' })
      const project = await createProject.call(this, { name, workspace, user })
      return project.serialize()
    },
  )
}
