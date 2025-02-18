import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import * as YAML from 'yaml'
import { ModuleUser } from '../../user'
import { getFlow } from '../utils'

export function flowGet(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows/:nameAndExtension',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        nameAndExtension: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, nameAndExtension } = parameters

      // --- Extract the name and optional extension from the parameters.
      const [name, extension] = /^([^.]*)\.(json|yaml)$/.exec(nameAndExtension)?.slice(1) as [string, 'json' | 'yaml']
      const flow = await getFlow.call(this, { user, workspace, project, name, permission: 'Read' })

      // --- Return as YAML if requested.
      if (extension === 'yaml') {
        const data = YAML.stringify(flow.data)
        setResponseHeader(event, 'Content-Type', 'application/yaml')
        setResponseHeader(event, 'Content-Disposition', `attachment; filename="${name}.yaml"`)
        return data
      }

      // --- Return as JSON if requested.
      if (extension === 'json') {
        setResponseHeader(event, 'Content-Type', 'application/json')
        setResponseHeader(event, 'Content-Disposition', `attachment; filename="${name}.json"`)
        return flow.data
      }

      // --- Return the serialized flow.
      return flow.serialize()
    },
  )
}
