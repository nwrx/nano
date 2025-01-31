import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSearch(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/projects',
      parseQuery: createSchema({
        workspace: assertStringNotEmpty,
        withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        page: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
      }),
    },
    async({ event, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true }) ?? {}
      const {
        workspace,
        withFlows = false,
        withAssignments = false,
        page = 1,
        limit = 10,
      } = query

      // --- Assert that the user has access and fetch the workspace.
      const { id } = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })

      const { Project } = this.getRepositories()
      const result = await Project.find({
        where: {
          workspace: { id },
        },
        relations: {
          flows: withFlows,
          assignments: withAssignments ? { user: true } : false,
        },
        take: limit,
        skip: (page - 1) * limit,
        order: { name: 'ASC' },
      })

      // --- Return the modules.
      return result.map(project => project.serialize())
    },
  )
}
