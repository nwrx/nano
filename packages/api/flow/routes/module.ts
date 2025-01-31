import type { ModuleFlow } from '../index'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function moduleGet(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/modules/:idOrKind',
      parameters: createSchema({
        idOrKind: assertStringNotEmpty,
      }),
      query: createSchema({
        withNodes: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ parameters, query }) => {
      const { idOrKind } = parameters
      const { withNodes = false } = query

      // --- Find the module by ID or slug.
      const { module, entity } = await this.resolveFlowModule(idOrKind)

      // --- Return the module.
      return {
        id: entity.id,
        name: module.name,
        kind: entity.kind,
        version: entity.version,
        description: module.description,
        nodes: withNodes ? module.nodes : undefined,
      }
    },
  )
}
