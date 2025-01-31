import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectGet(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project',
      parseParameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withSecrets: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withVariables: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true }) ?? {}
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
          assignments: query.withAssignments ? { user: { profile: true } } : false,
        },
        order: {
          name: 'ASC',
          secrets: { name: 'ASC' },
          variables: { name: 'ASC' },
        },
      })

      // --- Return the serialized project.
      if (!result) throw this.errors.PROJECT_NOT_FOUND(workspace, project)
      return result.serialize()
    },
  )
}
