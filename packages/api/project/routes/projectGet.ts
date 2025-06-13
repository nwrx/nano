import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject } from '../utils'

export function projectGet(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project',
      parseParameters: createParser({
        project: assert.stringNotEmpty,
        workspace: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and project.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, user, workspace, permission: 'Read' })

      // --- Return the serialized project.
      return project.serialize()
    },
  )
}
