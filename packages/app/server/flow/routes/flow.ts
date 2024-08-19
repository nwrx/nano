import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertStringUuid, createSchema } from 'unshared'

export function chainGet(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/flows/:id',
      parameters: createSchema({
        id: assertStringUuid,
      }),
    },
    async({ /* event, */ parameters }) => {
      const { id } = parameters
      const { Flow } = this.entities

      // --- Check if the user has the right permissions.
      // const userModule = this.getModule(ModuleUser)
      // await userModule.a11n(event, {
      //   optional: true,
      //   permissions: [this.permissions.FLOW_GET.id],
      // })

      // --- Fetch the flow.
      const flow = await Flow.findOne({ where: { id } })
      if (!flow) throw this.errors.FLOW_NOT_FOUND(id)
      return flow.serialize()

    },
  )
}
