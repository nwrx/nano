import type { ModuleProject } from '../index'
import type { ProjectUserPermissions } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject, getProjectAssignments } from '../utils'

export function projectAssignments(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/assignments',
      parseParameters: createSchema({
        project: assert.stringNotEmpty,
        workspace: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<ProjectUserPermissions[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and project.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, user, workspace, permission: 'Read' })
      return await getProjectAssignments.call(this, { project })
    },
  )
}
