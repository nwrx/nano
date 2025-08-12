import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow, removeFlow } from '../utils'

export function flowRemove(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/projects/:project/flows/:flow',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Write' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.flow, permission: 'Owner' })
      await removeFlow.call(this, { workspace, project, flow, user })
    },
  )
}
