import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertStringUuid, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'

export function moduleDelete(this: ModuleFlow) {
  return createRoute(
    {
      name: 'DELETE /api/modules/:id',
      parameters: createSchema({
        id: assertStringUuid,
      }),
    },

    async({ event, parameters }) => {
      const { FlowModule } = this.entities
      const { id } = parameters

      // --- Find the module by id.
      const module = await FlowModule.findOneBy({ id })
      if (!module) throw this.errors.FLOW_MODULE_NOT_FOUND(id)

      // --- Delete the module.
      await module.remove()
      setResponseStatus(event, 204)
    },
  )
}
