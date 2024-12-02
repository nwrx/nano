import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import * as YAML from 'yaml'
import { ModuleUser } from '../../user'
import { resolveFlow } from '../utils'

export function flowExport(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/:projectnameflow/export',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, name } = parameters

      // --- Resolve the flow and check if the user has access to it.
      const flow = await resolveFlow.call(this, { user, workspace, project, name, permission: 'Read' })

      // --- Return the serialized flow.
      const data = YAML.stringify(flow.data)
      setResponseHeader(event, 'Content-Type', 'application/yaml')
      setResponseHeader(event, 'Content-Disposition', `attachment; filename="${name}.yaml"`)
      return data
    },
  )
}
