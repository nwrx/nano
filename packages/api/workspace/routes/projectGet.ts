import type { ModuleWorkspace } from '../index'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectGet(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project',
      parameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      query: createSchema({
        withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withSecrets: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withVariables: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const user = await this.getModule(ModuleUser).authenticate(event, { optional: true })
      const { project, workspace } = parameters

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const { id } = await this.resolveProject({ user, name: project, workspace: workspaceResolved, permission: 'Read' })

      // --- Fetch the project from the database.
      const { WorkspaceProject } = this.getRepositories()
      const result = await WorkspaceProject.findOne({
        where: { id },
        relations: {
          flows: query.withFlows,
          secrets: query.withSecrets,
          variables: query.withVariables,
          assignments: query.withAssignments ? { user: true } : false,
        },
      })

      // --- Return the serialized project.
      if (!result) throw this.errors.PROJECT_NOT_FOUND(workspace, project)
      return result.serialize()
    },
  )
}
