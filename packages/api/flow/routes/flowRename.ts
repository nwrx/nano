import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow, renameFlow } from '../utils'

export function flowRename(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/projects/:project/flows/:flow/name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Write' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.flow, permission: 'Owner' })
      await renameFlow.call(this, { workspace, project, flow, user, name: body.name })
    },
  )
}
