/* eslint-disable sonarjs/todo-tag */
import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchProjects } from '../utils'

export function projectSearch(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        sortBy: [[assert.undefined], [assert.stringEnum(['name', 'title', 'createdAt', 'updatedAt'])]],
        sortDirection: [[assert.undefined], [assert.stringEnum(['ASC', 'DESC'])]],
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const projects = await searchProjects.call(this, { user, workspace, ...query })
      return projects.map(project => project.serialize(query))
    },
  )
}
