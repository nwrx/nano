import type { FlowObject, ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchFlow } from '../utils'

export function flowSearch(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.string]],
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        order: [[assert.undefined], [assert.objectStrict]],
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<FlowObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const flows = await searchFlow.call(this, { user, project, ...query })
      return flows.map(flow => flow.serialize(query))
    },
  )
}
