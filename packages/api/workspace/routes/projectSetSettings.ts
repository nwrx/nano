import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assertNil, assertString, assertStringNotEmpty, createSchema } from '@unshared/validation'

export function projectSetSettings(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project',
      parameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      body: createSchema({
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
