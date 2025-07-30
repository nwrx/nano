import type { FlowObject } from '../entities'
import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow } from '../utils'

export function flowGet(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows/:name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        name: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<FlowObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.name, permission: 'Read', ...query })
      return flow.serialize(query)
    },
  )
}
