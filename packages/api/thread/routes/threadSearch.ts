import type { ThreadObject } from '../entities'
import type { ModuleThread } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchThreads } from '../utils'

export function threadSearch(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        withSchema: [[assert.undefined], [assert.string, parseBoolean]],
        withEvents: [[assert.undefined], [assert.string, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<ThreadObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleFlow = this.getModule(ModuleFlow)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, project, and flow with proper permissions.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
      const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })

      // --- Search for threads and return them serialized.
      const threads = await searchThreads.call(this, { user, workspace, project, flow, ...query })
      return threads.map(thread => thread.serialize(query))
    },
  )
}
