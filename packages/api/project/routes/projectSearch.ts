/* eslint-disable sonarjs/todo-tag */
import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
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
      }),
    },
    async({ event, parameters, query }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })
      const { search, page = 1, limit = 10 } = query

      // --- Assert that the user has access and fetch the workspace.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const projects = await searchProjects.call(this, { user, page, limit, search, workspace })

      // --- Return the projects.
      return projects.map(project => project.serialize())
    },
  )
}
