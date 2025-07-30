import type { ModuleProject } from '../index'
import type { ProjectUserPermissions } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject, getProjectAssignments } from '../utils'

export function projectGetAssignments(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/assignments',
      parseParameters: createParser({
        project: assert.stringNotEmpty,
        workspace: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<ProjectUserPermissions[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, user, workspace, permission: 'Read' })
      return getProjectAssignments.call(this, { project })
    },
  )
}
