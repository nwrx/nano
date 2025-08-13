import type { ThreadObject } from '../entities'
import type { ModuleThread } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getThread } from '../utils'

export function threadGet(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/projects/:project/flows/:flow/threads/:thread',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
        thread: assert.stringUuid,
      }),
      parseQuery: createParser({
        withSchema: [[assert.undefined], [assert.string, parseBoolean]],
        withEvents: [[assert.undefined], [assert.string, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<ThreadObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleFlow = this.getModule(ModuleFlow)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the thread and return it serialized.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
      const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })
      const thread = await getThread.call(this, { id: parameters.thread, workspace, project, flow, user, ...query })
      return thread.serialize(query)
    },
  )
}
