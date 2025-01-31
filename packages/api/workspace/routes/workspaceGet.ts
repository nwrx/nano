import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function workspaceGet(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        withProjects: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withProjectFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withProjectAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true }) ?? {}
      const { workspace } = parameters

      // --- Assert that the user has access and fetch the workspace.
      const { id } = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const { Workspace } = this.getRepositories()
      const result = await Workspace.findOneOrFail({
        where: { id },
        relations: {
          projects: query.withProjects
            ? {
              flows: query.withProjectFlows,
              assignments: query.withProjectAssignments ? { user: true }: false,
            }
            : false,
          assignments: query.withAssignments ? { user: true } : false,
        },
      })

      // --- Return the modules.
      return result.serialize()
    },
  )
}
