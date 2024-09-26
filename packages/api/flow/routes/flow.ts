import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function flowGet(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project/flows/:flow',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
      query: createSchema({
        withData: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {

      // --- Resolve the flow and check if the user has access to it.
      const flow = await this.resolveFlow(event, {
        projectOwner: parameters.workspace,
        projectName: parameters.project,
        flowName: parameters.flow,
        permissions: ['Read'],
      })

      // --- Return the serialized flow.
      return {
        ...flow.serialize(),
        data: query.withData ? flow.data : undefined,
      }
    },
  )
}
