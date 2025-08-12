import type { ModuleThread } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getThread, removeThread } from '../utils'

export function threadRemove(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/projects/:project/flows/:flow/threads/:thread',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
        thread: assert.stringUuid,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleFlow = this.getModule(ModuleFlow)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Resolve the flow and assert the user has access to it.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
      const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })
      const thread = await getThread.call(this, { id: parameters.thread, workspace, project, flow, user })
      await removeThread.call(this, { workspace, project, flow, thread, user })
    },
  )
}
