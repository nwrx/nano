import type { ThreadInputObject } from '@nwrx/nano'
import type { ThreadObject } from '../entities'
import type { ModuleThread } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createThread, startThread } from '../utils'

export function threadStart(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/projects/:project/flows/:flow/threads',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        inputs: assert.objectStrict<ThreadInputObject>,
      }),
    },
    async({ event, parameters, body }): Promise<ThreadObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleFlow = this.getModule(ModuleFlow)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Create a new thread entity.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
      const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })
      const thread = await createThread.call(this, { user, flow, project, workspace })

      // --- Start the thread with the provided inputs and return it serialized.
      await startThread.call(this, { workspace, project, flow, thread, inputs: body.inputs })
      return thread.serialize()
    },
  )
}
