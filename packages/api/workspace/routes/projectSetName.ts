import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'

export function projectSetName(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/name',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      body: createSchema({
        name: [assertStringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }) => {
      const user = await this.getModule(ModuleUser).authenticate(event)
      const { project, workspace } = parameters
      const { name } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const projectResolved = await this.resolveProject({ user, name: project, workspace: workspaceResolved, permission: 'Write' })

      // --- Rename the project slug.
      projectResolved.name = name
      const { WorkspaceProject } = this.getRepositories()
      await WorkspaceProject.save(projectResolved)
    },
  )
}
