import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { resolveFlow } from '../utils'

export function flowGet(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        withData: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, name } = parameters

      // --- Return the serialized flow.
      const flow = await resolveFlow.call(this, { user, name, project, workspace, permission: 'Read' })
      const { withData = false } = query
      return flow.serialize({ withData })
    },
  )
}
