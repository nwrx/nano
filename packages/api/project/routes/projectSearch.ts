/* eslint-disable sonarjs/todo-tag */
import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchProjects } from '../utils'

export function projectSearch(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/projects',
      parseQuery: createSchema({
        workspace: assertStringNotEmpty,
        // TODO: Implement the following query parameters.
        // withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        // withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        // page: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
        // limit: [[assertUndefined], [assertStringNotEmpty, Number.parseInt]],
      }),
    },
    async({ event, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true }) ?? {}
      const {
        workspace,
        // withFlows = false,
        // withAssignments = false,
        // page = 1,
        // limit = 10,
      } = query

      // --- Assert that the user has access and fetch the workspace.
      const projects = await searchProjects.call(this, { search: workspace, user })
      return projects.map(project => project.serialize())
    },
  )
}
