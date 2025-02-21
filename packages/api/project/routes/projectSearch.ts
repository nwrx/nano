/* eslint-disable sonarjs/todo-tag */
import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchProjects } from '../utils'

export function projectSearch(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        search: [[assertUndefined], [assertStringNotEmpty]],
        page: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
        withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true })
      const { workspace } = parameters
      const {
        search,
        page = 1,
        limit = 10,
        withFlows = false,
        withAssignments = false,
      } = query

      // --- Assert that the user has access and fetch the workspace.
      const projects = await searchProjects.call(this, {
        user,
        page,
        limit,
        search,
        workspace,
        withFlows,
        withAssignments,
      })

      // --- Return the projects.
      return projects.map(project => project.serialize())
    },
  )
}
