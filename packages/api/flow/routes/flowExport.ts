import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import * as YAML from 'yaml'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow } from '../utils'

export function flowExport(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows/:flow/export',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        format: [[assert.undefined, () => 'yaml'], [assert.stringEnum('json', 'yaml')]],
        download: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<string> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.flow, permission: 'Read' })
      if (query.download)
        setResponseHeader(event, 'Content-Disposition', `attachment; filename="${flow.name}.${query.format}"`)
      if (query.format === 'yaml') {
        setResponseHeader(event, 'Content-Type', 'application/x-yaml')
        return YAML.stringify(flow.data)
      }
      else if (query.format === 'json') {
        setResponseHeader(event, 'Content-Type', 'application/json')
        return JSON.stringify(flow.data, undefined, 2)
      }
      // This should never happen due to the parser validation.
      throw new Error(`Unsupported export format: ${query.format}`)
    },
  )
}
