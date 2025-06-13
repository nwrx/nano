import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import * as YAML from 'yaml'
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
        format: [[assert.undefined], [assert.stringEnum('json', 'yaml')]],
        download: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Extract the name and optional extension from the parameters.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.name, permission: 'Read' })

      if (query.format === 'yaml') {
        const data = YAML.stringify(flow.data)
        setResponseHeader(event, 'Content-Type', 'application/yaml')
        // setResponseHeader(event, 'Content-Disposition', `attachment; filename="${parameters.name}.yaml"`)
        return data
      }

      // --- Return as JSON if requested.
      if (query.format === 'json') {
        setResponseHeader(event, 'Content-Type', 'application/json')
        // setResponseHeader(event, 'Content-Disposition', `attachment; filename="${parameters.name}.json"`)
        return flow.data
      }

      // --- Return the serialized flow.
      return flow.serialize()
    },
  )
}
