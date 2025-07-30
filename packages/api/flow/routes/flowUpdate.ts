import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow, updateFlow } from '../utils'

export function flowUpdate(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/projects/:project/flows/:name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        name: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        title: [[assert.undefined], [assert.string]],
        description: [[assert.undefined], [assert.string]],
      }),
    },
    async({ event, parameters, body }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Write' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.name, permission: 'Write' })
      await updateFlow.call(this, { workspace, project, flow, user, title: body.title, description: body.description })
    },
  )
}
