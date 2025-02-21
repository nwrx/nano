import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject } from '../utils'

export function projectRemove(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/projects/:project',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and project.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, user, workspace, permission: 'Owner' })

      // --- Soft remove the project.
      const { Project } = this.getRepositories()
      await Project.softRemove(project)
    },
  )
}
