import type { ModuleFlow } from '../index'
import type { FlowSchema } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow, getFlowSchema } from '../utils'

export function flowGetSchema(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/projects/:project/flows/:flow/schema',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<FlowSchema> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.flow, permission: 'Read' })
      return getFlowSchema({ workspace, project, flow })
    },
  )
}
