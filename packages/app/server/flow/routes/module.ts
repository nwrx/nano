import type { UUID } from 'node:crypto'
import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertUndefined, createSchema, EXP_UUID, parseBoolean } from 'unshared'

export function moduleGet(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/modules/:idOrSlug',
      parameters: createSchema({
        idOrSlug: assertStringNotEmpty,
      }),
      query: createSchema({
        withNodes: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withTypes: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ parameters, query }) => {
      const { FlowModule } = this.entities
      const { idOrSlug } = parameters
      const { withNodes = false, withTypes = false } = query

      // --- Find the module by ID or slug.
      const isUUID = EXP_UUID.test(idOrSlug)
      const module = await FlowModule.findOne({
        where: isUUID ? { id: idOrSlug as UUID } : { kind: idOrSlug },
      })

      // --- If the module is not found, return a 404.
      if (!module) throw this.errors.FLOW_MODULE_NOT_FOUND(idOrSlug)
      return await module.serialize({
        withNodes,
        withTypes,
      })
    },
  )
}
