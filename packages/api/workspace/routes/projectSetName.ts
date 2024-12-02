import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSetName(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
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
