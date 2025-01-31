import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertNil, assertString, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSetSettings(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project',
      parseParameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        title: [[assertNil], [assertStringNotEmpty]],
        description: [[assertNil], [assertString]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { project, workspace } = parameters

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const projectResolved = await this.resolveProject({ user, name: project, workspace: workspaceResolved, permission: 'Write' })

      // --- Update and save the project.
      if (body.title) projectResolved.title = body.title
      if (body.description) projectResolved.description = body.description
      const { WorkspaceProject } = this.getRepositories()
      await WorkspaceProject.save(projectResolved)
    },
  )
}
