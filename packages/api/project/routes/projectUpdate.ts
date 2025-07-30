import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject, updateProject } from '../utils'

export function projectUpdate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/projects/:project',
      parseParameters: createParser({
        project: assert.stringNotEmpty,
        workspace: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        title: [[assert.undefined], [assert.string]],
        description: [[assert.undefined], [assert.string]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { title, description } = body
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, workspace, user, permission: 'Write' })
      await updateProject.call(this, { workspace, project, title, description })
    },
  )
}
