import type { ModuleWorkspace } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function flowProjectDelete(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { project, workspace } = parameters

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const projectResolved = await this.resolveProject({ user, name: project, workspace: workspaceResolved, permission: 'Owner' })

      // --- Soft remove the project.
      const { WorkspaceProject } = this.getRepositories()
      await WorkspaceProject.softRemove(projectResolved)
    },
  )
}
